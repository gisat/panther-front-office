import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';

import WorldWind from '@nasaworldwind/worldwind';
import ExtendedOsmLayer from './layers/ExtendedOsmLayer';
import ExtendedWmsLayer from './layers/ExtendedWmsLayer';

import './style.css'

const {Location, Sector, WorldWindow} = WorldWind;

class WorldWindMap extends React.PureComponent {

	static propTypes = {
		backgroundLayer: PropTypes.object,
		layers: PropTypes.array,
		navigator: PropTypes.object,
	};

	constructor(props) {
		super(props);
		this.canvasId = utils.uuid();


		setTimeout(this.compareBackgroundLayers.bind(this, this.props.backgroundLayer, {
				key: "stamen-uuid",
				data: {
					key: "stamen-uuid",
					name: "Stamen terrain",
					type: "wmts",
					url: "http://tile.stamen.com/terrain",

					attribution: null,
					numLevels: null,
			     	opacity: null,
					prefixes: ["a", "b", "c"]
				}
			}), 5000);
	}

	componentDidMount() {
		this.wwd = new WorldWindow(this.canvasId);

		if (this.props.backgroundLayer) {
			this.addBackgroundLayer(this.props.backgroundLayer);
		}

		if (this.props.navigator){
			this.updateNavigator();
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps){
			this.compareBackgroundLayers(prevProps.backgroundLayer, this.props.backgroundLayer);
			this.updateNavigator();
		}
	}

	addBackgroundLayer(layerData) {
		if (layerData.data && layerData.data.type){
			switch (layerData.data.type){
				case "wms":
					this.addWmsLayer(layerData);
					break;
				case "wmts":
					this.addWmtsLayer(layerData);
					break;
			}
		}
	}

	addWmsLayer(layerData){
		this.wwd.insertLayer(0, new ExtendedWmsLayer({
				...layerData.data,
				service: layerData.data.url,
				sector: new Sector(-90, 90, -180, 180),
				levelZeroDelta: new Location(45, 45),
				format: "image/png",
				size: 256,
				version: "1.3.0",
			}, null));
	}

	addWmtsLayer(layerData) {
		this.wwd.insertLayer(0, new ExtendedOsmLayer(
			layerData.data,
			null
		));
	}

	compareBackgroundLayers(prevLayerData, nextLayerData) {
		if (nextLayerData && prevLayerData.key !== nextLayerData.key){
			this.addBackgroundLayer(nextLayerData);
			this.removeLayer(prevLayerData.key);
			this.wwd.redraw();
		}
	}

	removeLayer(layerKey) {
		let layer = _.find(this.wwd.layers, {key: layerKey});
		if (layer){
			this.wwd.removeLayer(layer);
		}
	}

	updateNavigator(){
		let state = this.wwd.navigator;
		let update = this.props.navigator;
		
		if (state.range !== update.range){
			state.range = update.range;
		}

		if (state.tilt !== update.tilt){
			state.tilt = update.tilt;
		}

		if (state.roll !== update.roll){
			state.roll = update.roll;
		}

		if (state.heading !== update.heading){
			state.heading = update.heading;
		}

		if (state.lookAtLocation.latitude !== update.lookAtLocation.latitude){
			state.lookAtLocation.latitude = update.lookAtLocation.latitude;
		}

		if (state.lookAtLocation.longitude !== update.lookAtLocation.longitude){
			state.lookAtLocation.longitude = update.lookAtLocation.longitude;
		}
	}

	render() {
		return (
			<div className="ptr-world-wind-map">
				<canvas className="ptr-world-wind-map-canvas" id={this.canvasId}>
					Your browser does not support HTML5 Canvas.
				</canvas>
			</div>
		);

	}
}

export default WorldWindMap;
