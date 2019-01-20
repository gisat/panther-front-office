import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';

import WorldWind from '@nasaworldwind/worldwind';

import layers from './layers/helpers';
import navigator from './navigator/helpers';
import {backgroundStamen, layersChange1, layersChange2, layersChange3} from './mockData';

import Attribution from './Attribution/Attribution';

import './style.css'

const {WorldWindow, ZeroElevationModel} = WorldWind;

class WorldWindMap extends React.PureComponent {

	static propTypes = {
		backgroundLayer: PropTypes.object,
		elevationModel: PropTypes.string,
		layers: PropTypes.array,
		navigator: PropTypes.object,
	};

	constructor(props) {
		super(props);
		this.canvasId = utils.uuid();

		// TODO only for testing
		setTimeout(() => {
			this.handleBackgroundLayers(this.props.backgroundLayer, backgroundStamen);
			this.props.backgroundLayer.data.attribution = backgroundStamen.data.attribution;
			this.forceUpdate();
		}, 5000);

		setTimeout(() => {
			this.handleLayers(layersChange1);
		}, 10000);

		setTimeout(() => {
			this.handleLayers(layersChange2);
		}, 15000);

		setTimeout(() => {
			this.handleLayers(layersChange3);
		}, 20000);
	}

	componentDidMount() {
		this.wwd = new WorldWindow(this.canvasId, this.getElevationModel());

		if (this.props.navigator){
			navigator.update(this.wwd, this.props.navigator);
		}

		if (this.props.backgroundLayer) {
			layers.addLayer(this.wwd, this.props.backgroundLayer.data, 0);
		}

		if (this.props.layers){
			this.handleLayers(this.props.layers);
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps){
			navigator.update(this.wwd, this.props.navigator);
			this.handleBackgroundLayers(prevProps.backgroundLayer, this.props.backgroundLayer);
			this.handleLayers(this.props.layers);
		}
	}

	handleBackgroundLayers(prevLayerData, nextLayerData) {
		if (nextLayerData && prevLayerData.key !== nextLayerData.key){
			layers.addLayer(this.wwd, nextLayerData.data, 0);
			layers.removeLayer(this.wwd, prevLayerData.key);
		}
	}

	handleLayers(nextLayersData) {
		let nextLayers = [];
		nextLayersData.forEach(layerData => {
			let existingLayer = layers.findLayerByKey(this.wwd, layerData.key);
			if (existingLayer){
				nextLayers.push(existingLayer);
			} else {
				let layer = layers.getLayerByType(layerData.data);
				if (layer){
					nextLayers.push(layer);
				}
			}
		});

		// TODO solve merge with other layer types (choropleths, AUs, ...)
		// add background layer
		nextLayers.unshift(this.wwd.layers[0]);

		this.wwd.layers = nextLayers;
		this.wwd.redraw();
	}

	/**
	 * @returns {null | ZeroElevationModel}
	 */
	getElevationModel() {
		switch (this.props.elevationModel) {
			case "default":
				return null;
			case null:
				return new ZeroElevationModel();
		}
	}

	render() {
		/* TODO handle attributions for more layers altogerter */
		return (
			<div className="ptr-world-wind-map">
				<canvas className="ptr-world-wind-map-canvas" id={this.canvasId}>
					Your browser does not support HTML5 Canvas.
				</canvas>
				{this.props.backgroundLayer && this.props.backgroundLayer.data.attribution ?
					<Attribution
						data={this.props.backgroundLayer.data.attribution}
					/> : null}
			</div>
		);

	}
}

export default WorldWindMap;
