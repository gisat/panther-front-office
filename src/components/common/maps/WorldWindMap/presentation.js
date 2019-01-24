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
		mapKey: PropTypes.string,
		onWorldWindNavigatorChange: PropTypes.func
	};

	constructor(props) {
		super(props);
		this.canvasId = utils.uuid();

		// TODO only for testing
		setTimeout(() => {
			this.handleBackgroundLayers(this.props.backgroundLayer, backgroundStamen);
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
		this.wwd.addEventListener("mousemove", this.onNavigatorChange.bind(this));
		this.wwd.addEventListener("wheel", this.onNavigatorChange.bind(this));

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
			if (this.props.navigator) {
				navigator.update(this.wwd, this.props.navigator);
			}
			if (this.props.backgroundLayer) {
				this.handleBackgroundLayers(prevProps.backgroundLayer, this.props.backgroundLayer);
			}
			if (this.props.layers) {
				this.handleLayers(this.props.layers);
			}
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
	 * Get attributions of all layers present in the map
	 * @returns {Array}
	 */
	getAttributions() {
		let attributions = [];

		if (this.props.backgroundLayer && this.props.backgroundLayer.data && this.props.backgroundLayer.data.attribution){
			attributions.push(this.props.backgroundLayer.data.attribution);
		}

		if (this.props.layers){
			this.props.layers.forEach(layer => {
				if (layer.data && layer.data.attribution){
					attributions.unshift(layer.data.attribution);
				}
			});
		}

		return attributions.length ? attributions : null;
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

	onNavigatorChange(event) {
		if (event && event.worldWindow) {
			let changedNavigatorParams = navigator.getChangedParams(this.props.navigator, event.worldWindow.navigator);
			if (!_.isEmpty(changedNavigatorParams)) {
				this.props.onWorldWindNavigatorChange(changedNavigatorParams);
			}
		}
	}

	render() {
		let attributions = this.getAttributions();

		return (
			<div className="ptr-world-wind-map">
				<canvas className="ptr-world-wind-map-canvas" id={this.canvasId}>
					Your browser does not support HTML5 Canvas.
				</canvas>
				{attributions ? <Attribution data={attributions}/> : null}
			</div>
		);

	}
}

export default WorldWindMap;
