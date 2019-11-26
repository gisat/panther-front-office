import React from 'react';
import WorldWind from 'webworldwind-esa';
import {QuadTree, Box, Point, Circle} from 'js-quadtree';
import * as turf from '@turf/turf';
import LargeDataLayerTile from "./LargeDataLayerTile";
import _ from 'lodash';

const {
	Location,
	REDRAW_EVENT_TYPE,
	Sector,
	SurfaceCircle,
	TiledImageLayer
} = WorldWind;

const DEFAULT_SIZE = 5;
const DEFAULT_POINT_HOVER_BUFFER = 0.01;

// It supports GeoJSON as format with only points and maximum 1 000 000 points.
// Multipolygons are represented as points

// TODO: Highlight the selected points.
class LargeDataLayer extends TiledImageLayer {
	constructor(wwd, options) {
		super(new Sector(-90, 90, -180, 180), new Location(45, 45), 18, 'image/png', 'large-data-layer', 256, 256);

		this.tileWidth = 256;
		this.tileHeight = 256;

		this.pointHoverBuffer = options.pointHoverBuffer || DEFAULT_POINT_HOVER_BUFFER;
		this.renderableLayer = options.renderableLayer;
		this.style = options.style && options.style.data && options.style.data.definition;

		// At the moment the URL must contain the GeoJSON.
		this.processedTiles = {};
		this.quadTree = new QuadTree(new Box(0,0,360,180));

		this.onHover = options.onHover;
		this.gidColumn = options.gidColumn;

		if (options.features) {
			this.addFeatures(options.features);
		} else {
			this.loadData(options.url);
		}

		this.onClick = this.onClick.bind(this, wwd);
		this.onMouseMove = this.onMouseMove.bind(this, wwd);
		wwd.addEventListener('click', this.onClick);
		wwd.addEventListener('mousemove', this.onMouseMove);
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

			// TODO support other geometry types
			if (type === 'Point') {
				point = new Point(feature.geometry.coordinates[0] + 180, feature.geometry.coordinates[1] + 90, feature.properties);
			} else if (type === 'MultiPolygon') {
				let centroid = turf.centroid(feature.geometry);
				point = new Point(centroid.geometry.coordinates[0] + 180, centroid.geometry.coordinates[1] + 90, feature.properties);
			}

			if (point) {
				this.quadTree.insert(
					point
				);
			}
		});
	}

	handleEvent(wwd, event) {
		const x = event.touches && event.touches[0] && event.touches[0].clientX || event.clientX,
			y = event.touches && event.touches[0] && event.touches[0].clientY || event.clientY;

		const pageX = event.touches && event.touches[0] && event.touches[0].pageX || event.pageX;
		const pageY = event.touches && event.touches[0] && event.touches[0].pageY || event.pageY;

		const terrainObject = wwd.pickTerrain(wwd.canvasCoordinates(x, y)).terrainObject();

		if (terrainObject) {
			const position = terrainObject.position;
			const points = this.quadTree.query(new Circle(position.longitude + 180, position.latitude + 90, this.pointHoverBuffer));

			if(this.renderableLayer) {
				this.renderableLayer.removeAllRenderables();
				if(points.length > 0) {
					const radius = DEFAULT_SIZE;
					this.renderableLayer.addRenderable(
						new SurfaceCircle(new Location(points[0].y - 90, points[0].x - 180), radius)
					);
				}
				wwd.redraw();
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
		if (this.onHover) {
			let gids = data.points.map(point => point[this.gidColumn]);
			let content = (
				<div>
					{data.points.map(point => {
						let content = [];
						_.forIn(point.data, (value,key) => {
							content.push(<div>{key}: {value}</div>)
						});
						return content;
					})}
				</div>
			);
			this.onHover(gids, data.x, data.y, content);
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
		return new LargeDataLayerTile(data, options, this.style);
	};
}

export default LargeDataLayer;