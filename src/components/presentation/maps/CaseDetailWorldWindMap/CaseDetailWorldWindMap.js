import React from 'react';
import PropTypes from 'prop-types';
import {map as mapUtils} from '@gisatcz/ptr-utils';
import _ from 'lodash';
import WorldWind from 'webworldwind-esa';

import Layers from '../../../../view/worldWind/layers/Layers';
import Controls from '../../../../view/worldWind/controls/Controls';

import './CaseDetailWorldWindMap.css';

class CaseDetailWorldWindMap extends React.PureComponent {

	static propTypes = {
		activeBackgroundLayerKey: PropTypes.string,
		bbox: PropTypes.string,
		onGeometryChange: PropTypes.func,
		caseGeometry: PropTypes.object,
		zoomToGeometry: PropTypes.bool
	};

	static defaultProps = {
		activeBackgroundLayerKey: null,
	};

	constructor(props){
		super(props);
		this.canvasId = "world-wind-canvas-case-detail";
	}

	componentDidMount(){
		this.wwd = new WorldWind.WorldWindow(this.canvasId);
		this.mapControls = new Controls({
			worldWindow: this.wwd,
			mapContainerClass: "world-wind-globe",
			type: "basic",
			classes: "small"
		});

		// TODO remove dependency on obsolete code
		this.layersControl = new Layers(this.wwd);
		if (this.props.activeBackgroundLayerKey){
			this.changeBackgroundLayer(this.props.activeBackgroundLayerKey);
		}

		this.aoiLayer = new WorldWind.RenderableLayer("aoi-layer");
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

	componentWillReceiveProps(nextProps, prevProps){
		if (_.isEmpty(prevProps) || (nextProps.activeBackgroundLayerKey !== prevProps.activeBackgroundLayerKey)){
			this.changeBackgroundLayer(nextProps.activeBackgroundLayerKey);
		}

		if (nextProps.bbox || nextProps.caseGeometry){
			this.aoiLayer.removeAllRenderables();
			if (nextProps.caseGeometry){
				this.drawGeometry(nextProps.caseGeometry);
			}
			this.zoomToGeometry(nextProps);
		}
	}

	changeBackgroundLayer(key){
		if (key){
			this.layersControl.removeAllLayersFromGroup('background-layers');
			this.layersControl.addBackgroundLayer(key, 'background-layers');
			this.wwd.redraw();
		}
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
		let canvasCoordinates = this.wwd.canvasCoordinates(x, y);
		let currentPoint = this.wwd.pickTerrain(canvasCoordinates);

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
		let geometry = mapUtils.getPolygonGeometryFromWorldWindPositions(positions);
		if (geometry){
			this.aoiLayer.removeAllRenderables();
			this.drawGeometry(geometry);
			this.props.onGeometryChange(geometry);
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
				navigatorParams = mapUtils.getNavigatorParamsFromGeometry(props.caseGeometry, this.wwd);
			} else if (props.bbox){
				navigatorParams = mapUtils.getNavigatorParamsFromBbox(props.bbox, this.wwd);
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

export default CaseDetailWorldWindMap;
