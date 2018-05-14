import React from 'react';
import PropTypes from 'prop-types';
import mapUtils from '../../../../../utils/map';
import _ from 'lodash';
import WorldWind from '@nasaworldwind/worldwind';

import './WorldWindow.css';

class WorldWindow extends React.PureComponent {

	static propTypes = {
		bbox: PropTypes.string,
		caseGeometry: PropTypes.object,
		zoomToGeometry: PropTypes.bool
	};

	constructor(props){
		super(props);
		this.canvasId = "world-wind-canvas-case-detail";
	}

	componentDidMount(){
		this.wwd = new WorldWind.WorldWindow(this.canvasId);
		let backgroundLayer = new WorldWind.BingAerialWithLabelsLayer(null);
		this.aoiLayer = new WorldWind.RenderableLayer("aoi-layer");

		this.wwd.addLayer(backgroundLayer);
		this.wwd.addLayer(this.aoiLayer);

		if (this.props.zoomToGeometry){
			this.zoomToGeometry(this.props);
		}
		if (this.props.caseGeometry){
			this.drawGeometry(this.props.caseGeometry);
		}

		this._clickRecognizer = new WorldWind.ClickRecognizer(this.wwd.canvas, this.onClick.bind(this));
		this._clickRecognizer.enabled = true;
		this._clickRecognizer.numberOfClicks = 2;
		this._clickRecognizer.maxClickInterval = 3000;
	}

	componentWillReceiveProps(nextProps){
		this.aoiLayer.removeAllRenderables();

		if (nextProps.caseGeometry){
			this.drawGeometry(nextProps.caseGeometry);
		}
		this.zoomToGeometry(nextProps);
	}

	/**
	 * @param geometry {Object} GeoJSON geometry
	 */
	drawGeometry(geometry){
		let geoJson = {
			"type": "Feature",
			"geometry": geometry,
			"properties": {
				"name": "AOI"
			}
		};

		let geoJsonParser = new WorldWind.GeoJSONParser(JSON.stringify(geoJson));
		geoJsonParser.load(null, this.shapeConfigurationCallback.bind(this), this.aoiLayer);

		this.wwd.redraw();
	}

	getPositionFromCanvasCoordinates (x, y){
		let currentPoint = this.wwd.pickTerrain(this.wwd.canvasCoordinates(x, y));

		if(!currentPoint.objects.length) {
			alert('Please click on the area containing the globe.');
			return;
		}
		return currentPoint.objects[0].position;
	};

	onClick(recognizer){
		let positions = recognizer.clicks.map(click => {
			return this.getPositionFromCanvasCoordinates(click.clientX, click.clientY);
		});
		let geometry = mapUtils.getPoltgonGeometryFromWorldWindPositions(positions);
		if (geometry){
			this.aoiLayer.removeAllRenderables();
			this.drawGeometry(geometry);
		}
	}

	shapeConfigurationCallback(geometry, properties){
		let configuration = {};

		if (geometry.isPolygonType() || geometry.isMultiPolygonType()) {
			configuration.attributes = new WorldWind.ShapeAttributes(null);
			configuration.attributes.outlineColor = new WorldWind.Color(1, 0, 0, 1);
			configuration.attributes.outlineWidth = 2;
			configuration.attributes.interiorColor = new WorldWind.Color(1, 1, 1, 0);
		}
		return configuration;
	}

	zoomToGeometry(props){
		if (props.zoomToGeometry){
			let navigatorParams = null;
			if (props.caseGeometry){
				navigatorParams = mapUtils.getNavigatorParamsFromGeometry(props.caseGeometry, this.wwd.viewport);
			} else if (props.bbox){
				navigatorParams = mapUtils.getNavigatorParamsFromBbox(props.bbox, this.wwd.viewport);
			}
			if (navigatorParams){
				this.wwd.navigator.lookAtLocation.latitude = navigatorParams.lookAtLocation.latitude;
				this.wwd.navigator.lookAtLocation.longitude = navigatorParams.lookAtLocation.longitude;
				this.wwd.navigator.range = navigatorParams.range;
				this.wwd.redraw();
			}
		}
	}

	render() {
		return (
			<div className="world-wind-globe">
				<canvas className="world-wind-canvas" id={this.canvasId}>
					Your browser does not support HTML5 Canvas.
				</canvas>
			</div>
		);
	}
}

export default WorldWindow;
