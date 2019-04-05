import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _, {isEqual} from 'lodash';

import WorldWind from '@nasaworldwind/worldwind';

import layers from './layers/helpers';
import navigator from './navigator/helpers';

import Attribution from './Attribution/Attribution';

import './style.css'

const {WorldWindow, ZeroElevationModel} = WorldWind;

class WorldWindMap extends React.PureComponent {

	static propTypes = {
		backgroundLayer: PropTypes.array,
		elevationModel: PropTypes.string,
		layers: PropTypes.array,
		navigator: PropTypes.object,
		mapKey: PropTypes.string,
		onWorldWindNavigatorChange: PropTypes.func,
		setActiveMapKey: PropTypes.func,
		delayedWorldWindNavigatorSync: PropTypes.number
	};

	constructor(props) {
		super(props);
		this.canvasId = utils.uuid();
		this.changedNavigatorTimeout = false;
		this.setMapKeyTimeout = false;
	}

	componentDidMount() {
		this.wwd = new WorldWindow(this.canvasId, this.getElevationModel());
		this.wwd.addEventListener("mousemove", this.onNavigatorChange.bind(this));
		this.wwd.addEventListener("wheel", this.onNavigatorChange.bind(this));

		if (this.props.navigator){
			navigator.update(this.wwd, this.props.navigator);
		}

		if (this.props.backgroundLayer) {
			this.props.backgroundLayer.forEach(layer => {
				layers.addLayer(this.wwd, layer, 0);
			});
		}

		if (this.props.layers || this.props.layers === null) {
			const layers = this.props.layers || [];
			this.handleLayers(layers);
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

			//check if already in map?
			if (!isEqual(prevProps.layers, this.props.layers)) {
				const layers = this.props.layers || [];
				this.handleLayers(layers);
			}
		}
	}

	handleBackgroundLayers(prevLayerData, nextLayerData) {
		if (!prevLayerData) {
			this.props.backgroundLayer.forEach(layer => {
				layers.addLayer(this.wwd, layer, 0);
			});
		} else if (nextLayerData && !_.isEqual(prevLayerData, nextLayerData)){
			nextLayerData.forEach(layer => {
				layers.addLayer(this.wwd, layer, 0);
			});
			prevLayerData.forEach(layer => {
				layers.removeLayer(this.wwd, layer.key);
			});
		}
	}

	handleLayers(nextLayersData = []) {
		let nextLayers = [];
		nextLayersData.forEach(data => {
			let existingLayer = layers.findLayerByKey(this.wwd, data.key);
			if (existingLayer){
				nextLayers.push(existingLayer);
			} else {
				let layer = layers.getLayerByType(data);
				if (layer){
					nextLayers.push(layer);
				}
			}
		});

		// add background layer
		if (this.props.backgroundLayer) {
			let backgroundLayer = this.wwd.layers.slice(0, this.props.backgroundLayer.length);
			nextLayers = backgroundLayer.concat(nextLayers);
		}

		//if no layers, than add colored layer
		if(nextLayers.length === 0) {
			const earthBlueColor = '#6fafdc';
			// const layer = layers.getLayerByType({type:'colored', color: earthBlueColor});
			const layer = layers.getLayerByType({type:'colored'});
			nextLayers.push(layer)
		}

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
			//setActive mapKey
			const changedNavigatorParams = navigator.getChangedParams(this.props.navigator, event.worldWindow.navigator);
			if (!_.isEmpty(changedNavigatorParams)) {
				if(this.setMapKeyTimeout) {
					clearTimeout(this.setMapKeyTimeout);
				}
				this.setMapKeyTimeout = setTimeout(() => {this.props.setActiveMapKey()}, 100)
			}

			if(this.props.onWorldWindNavigatorChange) {
				if (!_.isEmpty(changedNavigatorParams)) {
					if (this.props.delayedWorldWindNavigatorSync) {
						if (this.changedNavigatorTimeout) {
							clearTimeout(this.changedNavigatorTimeout);
						}
						this.changedNavigatorTimeout = setTimeout(() => {
							this.props.onWorldWindNavigatorChange(changedNavigatorParams);
						}, this.props.delayedWorldWindNavigatorSync)
					} else {
						this.props.onWorldWindNavigatorChange(changedNavigatorParams);
					}
				}
			}
		}
	}

	render() {
		let attributions = this.getAttributions();

		return (
			<div className="ptr-world-wind-map" onClick={this.props.setActiveMapKey}>
				<canvas className="ptr-world-wind-map-canvas" id={this.canvasId}>
					Your browser does not support HTML5 Canvas.
				</canvas>
				{attributions ? <Attribution data={attributions}/> : null}
			</div>
		);

	}
}

export default WorldWindMap;
