import React from 'react';
import WorldWind from 'webworldwind-esa';
import {QuadTree, Box, Point, Circle} from 'js-quadtree';
import * as turf from '@turf/turf';
import LargeDataLayerTile from "./LargeDataLayerTile";
import _ from 'lodash';
import {style} from "redux-logger/src/diff";

const {
	Location,
	REDRAW_EVENT_TYPE,
	Sector,
	SurfaceCircle,
	TiledImageLayer
} = WorldWind;

const DEFAULT_SIZE = 5;

// It supports GeoJSON as format with only points and maximum 1 000 000 points.
// Multipolygons are represented as points

// TODO: Highlight the selected points.
class LargeDataLayer extends TiledImageLayer {
	constructor(wwd, options, layer) {
		super(new Sector(-90, 90, -180, 180), new Location(45, 45), 18, 'image/png', 'large-data-layer', 256, 256);
		
		this.tileWidth = 256;
		this.tileHeight = 256;

		// At the moment the URL must contain the GeoJSON.
		this.processedTiles = {};
		this.quadTree = new QuadTree(new Box(0,0,360,180));

		this.pantherProps = {
			features: options.features,
			fidColumnName: options.fidColumnName,
			hovered: options.hovered,
			layerKey: layer.layerKey,
			onHover: options.onHover,
			pointHoverBuffer: options.pointHoverBuffer || DEFAULT_SIZE,
			style: options.style,
			wwd: wwd
		};
		
		if (this.pantherProps.features) {
			this.addFeatures(this.pantherProps.features);
		} else {
			this.loadData(options.url);
		}

		this.onClick = this.onClick.bind(this, wwd);
		this.onMouseMove = this.onMouseMove.bind(this, wwd);
		wwd.addEventListener('click', this.onClick);
		wwd.addEventListener('mousemove', this.onMouseMove);
	}

	removeListeners() {
		this.pantherProps.wwd.removeEventListener('click', this.onClick);
		this.pantherProps.wwd.removeEventListener('mousemove', this.onMouseMove);
	}

	loadData(url) {
		fetch(url).then(data => {
			return data.json();
		}).then(file => {
			if(file.features.length > 1000000) {
				throw new Error('Too many features.');
			}

			this.addFeatures(file.features);
		});
	}

	addFeatures(features) {
		features.forEach(feature => {
			const type = feature.geometry && feature.geometry.type;
			let point = null;
			let props = {...feature.properties};


			// TODO support other geometry types
			if (type === 'Point') {
				props.centroid = feature.geometry.coordinates;
				point = new Point(feature.geometry.coordinates[0] + 180, feature.geometry.coordinates[1] + 90, props);
			} else if (type === 'MultiPolygon') {
				let centroid = turf.centroid(feature.geometry);
				props.centroid = centroid.geometry.coordinates;
				point = new Point(centroid.geometry.coordinates[0] + 180, centroid.geometry.coordinates[1] + 90, props);
			}

			if (point) {
				this.quadTree.insert(
					point
				);
			}
		});

		this.refresh();
	}

	handleEvent(wwd, event) {
		const x = event.touches && event.touches[0] && event.touches[0].clientX || event.clientX,
			y = event.touches && event.touches[0] && event.touches[0].clientY || event.clientY;

		const pageX = event.touches && event.touches[0] && event.touches[0].pageX || event.pageX;
		const pageY = event.touches && event.touches[0] && event.touches[0].pageY || event.pageY;

		const terrainObject = wwd.pickTerrain(wwd.canvasCoordinates(x, y)).terrainObject();

		let buffer = this.getPointHoverBuffer(wwd);

		if (terrainObject) {
			const position = terrainObject.position;
			let points = this.quadTree.query(new Circle(position.longitude + 180, position.latitude + 90, buffer));

			// find nearest
			if (points.length > 1) {
				let targetPoint = turf.point([position.longitude, position.latitude]);
				let features = points.map(point => {
					return turf.point([point.data.centroid[0], point.data.centroid[1]], {...point});
				});

				let featureCollection = turf.featureCollection(features);
				let nearest = turf.nearestPoint(targetPoint,featureCollection);
				points = [nearest.properties];
			}

			return {points, x: pageX, y: pageY};
		} else {
			return {points: [], x: pageX, y: pageY};
		}
	}

	onMouseMove(wwd, event) {
		this.onMouseMoveResult(this.handleEvent(wwd, event));
	}

	onClick(wwd, event) {
		this.onClickResult(this.handleEvent(wwd, event));
	}

	onClickResult(points){}

	onMouseMoveResult(data) {
		if (this.pantherProps.onHover) {
			let gids = data.points.map(point => point.data[this.pantherProps.fidColumnName]);

			// TODO provisional content
			let content = (
				<div>
					{data.points.map(point => {
						let content = [];
						_.forIn(point.data, (value,key) => {
							if (key !== 'centroid') {
								content.push(<div>{key}: {value}</div>)
							}
						});
						return content;
					})}
				</div>
			);
			this.pantherProps.onHover(this.pantherProps.layerKey, gids, data.x, data.y, content, data.points);
		}
	}


	retrieveTileImage(dc, tile, suppressRedraw) {
		// if(tile.level.levelNumber < 14 || this.processedTiles[tile.imagePath]){
		// 	return;
		// }
		this.processedTiles[tile.imagePath] = true;

		const sector = tile.sector;
		const extended = this.calculateExtendedSector(sector, 0.2, 0.2);
		const extendedWidth = Math.ceil(extended.extensionFactorWidth * this.tileWidth);
		const extendedHeight = Math.ceil(extended.extensionFactorHeight * this.tileHeight);

		const points = this.filterGeographically(extended.sector);

		if(points) {
			var imagePath = tile.imagePath,
				cache = dc.gpuResourceCache,
				layer = this;

			var canvas = this.createPointTile(points, {
				sector: extended.sector,

				width: this.tileWidth + 2 * extendedWidth,
				height: this.tileHeight + 2 * extendedHeight
			}).canvas();

			var result = document.createElement('canvas');
			result.height = this.tileHeight;
			result.width = this.tileWidth;
			result.getContext('2d').putImageData(
				canvas.getContext('2d').getImageData(extendedWidth, extendedHeight, this.tileWidth, this.tileHeight),
				0, 0
			);

			var texture = layer.createTexture(dc, tile, result);
			layer.removeFromCurrentRetrievals(imagePath);

			if (texture) {
				cache.putResource(imagePath, texture, texture.size);

				layer.currentTilesInvalid = true;
				layer.absentResourceList.unmarkResourceAbsent(imagePath);

				if (!suppressRedraw) {
					// Send an event to request a redraw.
					const e = document.createEvent('Event');
					e.initEvent(REDRAW_EVENT_TYPE, true, true);
					window.dispatchEvent(e);
				}
			}
		}
	}

	filterGeographically(sector) {
		const width = sector.maxLongitude - sector.minLongitude;
		const height = sector.maxLatitude - sector.minLatitude;
		return this.quadTree.query(new Box(
			sector.minLongitude + 180,
			sector.minLatitude + 90,
			width,
			height
		));
	}

	calculateExtendedSector(sector, extensionFactorWidth, extensionFactorHeight) {
		var latitudeChange = (sector.maxLatitude - sector.minLatitude) * extensionFactorHeight;
		var longitudeChange = (sector.maxLongitude - sector.minLongitude) * extensionFactorWidth;
		return {
			sector: new Sector(
				sector.minLatitude - latitudeChange,
				sector.maxLatitude + latitudeChange,
				sector.minLongitude - longitudeChange,
				sector.maxLongitude + longitudeChange
			),
			extensionFactorHeight: extensionFactorHeight,
			extensionFactorWidth: extensionFactorWidth
		};
	};

	createPointTile(data, options) {
		return new LargeDataLayerTile(data, options, this.pantherProps.style, this.pantherProps.fidColumnName, this.pantherProps.hovered);
	};



	/**
	 * @param hovered {Object}
	 * @param hovered.style {Object}
	 * @param hovered.keys {Array}
	 */
	updateHovered(hovered) {
		this.pantherProps.hovered = {...hovered};
		this.refresh();
	}

	/**
	 * naive point hover buffer determination
	 * @param wwd
	 * @return {number} buffer in degrees
	 */
	getPointHoverBuffer(wwd) {
		const canvasWidth = wwd.canvas.clientWidth;
		const range = wwd.navigator.range;
		const bufferInMeters = range/canvasWidth * this.pantherProps.pointHoverBuffer;
		return bufferInMeters * 0.00001;
	}
}

export default LargeDataLayer;