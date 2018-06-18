import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import WorldWind from '@nasaworldwind/worldwind';

import Layers from '../../../../view/worldWind/layers/Layers';
import Controls from '../../../../view/worldWind/controls/Controls';
import mapUtils from "../../../../utils/map";
import MyWmsLayer from '../../../../worldwind/layers/MyWmsLayer';
import WfsService from '../../../../worldwind/ogc/wfs/WfsService';

const WorldWindow = WorldWind.WorldWindow,
	Sector = WorldWind.Sector,
	Location = WorldWind.Location,
    ClickRecognizer = WorldWind.ClickRecognizer;

class MapEditingWorldWindMap extends React.PureComponent {

	static propTypes = {
		activeBackgroundLayerKey: PropTypes.string,
		bbox: PropTypes.string,
		mapContainerClass: PropTypes.string,
		sourceLayer: PropTypes.string
	};

	constructor(props){
		super(props);
		this.canvasId = "world-wind-canvas-map-editing";
		this.wfsService = WfsService.create('http://192.168.2.205/geoserver/wfs');
	}

	componentDidMount(){
		const wwd = new WorldWindow(this.canvasId);
		this.wwd = wwd;

		this.mapControls = new Controls({
			worldWindow: wwd,
			mapContainerClass: this.props.mapContainerClass
		});

		// TODO zoom to same position as scenario map
		if (this.props.bbox){
			this.zoomToBbox(this.props.bbox);
		}

		// TODO remove dependency on obsolete code
		this.layersControl = new Layers(wwd);
		if (this.props.activeBackgroundLayerKey){
			this.changeBackgroundLayer(this.props.activeBackgroundLayerKey);
		}

		// Add WMS Layer
		wwd.addLayer(new MyWmsLayer({
            service: "http://192.168.2.205/geoserver/wfs",
            layerNames: "geonode:pucs_514f7a7552564ceebd269a8d334f1324",
            sector: new Sector(-90, 90, -180, 180),
            levelZeroDelta: new Location(45, 45),
            numLevels: 14,
            format: "image/png",
            opacity: 1,
            size: 256,
            version: "1.3.0",
			styleNames: "urbanAtlas"
		}));

		// Add Click Recognizer to use for construction of WFS.
        const clickRecognizer = new ClickRecognizer(wwd.canvas, (event) => {
        	console.log(event);
            let x = event._clientX;
            let y = event._clientY;

            const topLeft = wwd.pickTerrain(wwd.canvasCoordinates(x, y)).objects[0].position;
            const rightBottom = wwd.pickTerrain(wwd.canvasCoordinates(x + 1, y + 1)).objects[0].position;
            this.wfsService.getFeature('geonode:pucs_514f7a7552564ceebd269a8d334f1324',
				new Sector(
					rightBottom.latitude,
                    topLeft.latitude,
                    topLeft.longitude,
					rightBottom.longitude
				)).then(feature => {
				console.log(feature);
			});
        });
        clickRecognizer.enabled = true;
	}

	// Layer info needs to be in props.

	// Load the selected WMS Layer
	// Click should get the polygon via WFS
	// On Change of the polygon draw the data

	componentWillReceiveProps(nextProps, prevProps){
		if (_.isEmpty(prevProps) || (nextProps.activeBackgroundLayerKey !== prevProps.activeBackgroundLayerKey)){
			this.changeBackgroundLayer(nextProps.activeBackgroundLayerKey);
		}

		if (nextProps.bbox){
			this.zoomToBbox(nextProps.bbox);
		}
	}

	changeBackgroundLayer(key){
		if (key){
			this.layersControl.removeAllLayersFromGroup('background-layers');
			this.layersControl.addBackgroundLayer(key, 'background-layers');
			this.wwd.redraw();
		}
	}

	zoomToBbox(bbox){
        const wwd = this.wwd,
			navigator = this.wwd.navigator;
        let navigatorParams = mapUtils.getNavigatorParamsFromBbox(bbox, wwd);
		if (navigatorParams){
			navigator.lookAtLocation.latitude = navigatorParams.lookAtLocation.latitude;
			navigator.lookAtLocation.longitude = navigatorParams.lookAtLocation.longitude;
			navigator.range = navigatorParams.range;
			wwd.redraw();
		}
	}

	render() {
		return (
			<div className="world-wind-container">
				<canvas className="world-wind-canvas" id={this.canvasId}>
					Your browser does not support HTML5 Canvas.
				</canvas>
			</div>
		);
	}
}

export default MapEditingWorldWindMap;
