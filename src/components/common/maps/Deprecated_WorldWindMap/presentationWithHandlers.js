import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {utils} from "panther-utils"
import _, {isEqual, isNull} from 'lodash';

import WorldWind from 'webworldwind-esa';

import layers from './layers/helpers';
import navigator from './navigator/helpers';

import ExtendedRenderableLayer from './layers/ExtendedGeoJsonLayer';
import {defaultVectorStyle} from "./layers/utils/vectorStyle";

import Attribution from './Attribution/Attribution';

import './style.scss'

const {WorldWindow, ElevationModel} = WorldWind;

class WorldWindMap extends React.PureComponent {

	static propTypes = {
		backgroundLayer: PropTypes.array,
		elevationModel: PropTypes.string,
		layers: PropTypes.array,
		layersVectorData: PropTypes.object,
		navigator: PropTypes.object,
		mapKey: PropTypes.string,
		onWorldWindNavigatorChange: PropTypes.func,
		setActiveMapKey: PropTypes.func,
		delayedWorldWindNavigatorSync: PropTypes.number,
		loadLayerData: PropTypes.func,
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

		this.handleBackgroundLayers(null, this.props.backgroundLayer);

		if (this.props.layers || this.props.layers === null) {
			const layers = this.props.layers || [];
			this.handleLayers(layers, this.props.layersVectorData);
		}
}

	componentDidUpdate(prevProps) {
		if (prevProps){
			if (this.props.navigator) {
				navigator.update(this.wwd, this.props.navigator);
			}

			if (!isEqual(prevProps.backgroundLayer, this.props.backgroundLayer)) {
				this.handleBackgroundLayers(prevProps.backgroundLayer, this.props.backgroundLayer);
			}

			//check if already in map?
			if (!isEqual(prevProps.layers, this.props.layers) || !isEqual(prevProps.layersVectorData, this.props.layersVectorData)) {
				const layers = this.props.layers || [];
				this.handleLayers(layers, this.props.layersVectorData);
			}

			//check if new data comes
			if (!isEqual(prevProps.layersVectorData, this.props.layersVectorData)) {
				const layers = this.props.layers || [];
				this.handleVectorData(layers, this.props.layersVectorData);
			}
		}
	}

	handleBackgroundLayers(prevLayerData, nextLayerData) {
		

		const newBackgroundLayer = isNull(prevLayerData) && !isNull(nextLayerData);
		const removeBackgroundLayer = !isNull(prevLayerData) && isNull(nextLayerData);
		const changedBackgroundLayer = !isNull(prevLayerData) && !isNull(nextLayerData) && !_.isEqual(prevLayerData, nextLayerData);
		const noBackgroundLayer = isNull(prevLayerData) && isNull(nextLayerData);

		// Clear section
		if (newBackgroundLayer) {
			//try to remove colored layer
			this.wwd.layers = layers.removeLayer(this.wwd.layers, 'colored');

		} else if(removeBackgroundLayer || changedBackgroundLayer) {
			prevLayerData.forEach(layer => {
				this.wwd.layers = layers.removeLayer(this.wwd.layers, layer.key);
			});
		}

		//Add section
		if (newBackgroundLayer || changedBackgroundLayer) {
			nextLayerData.forEach(layer => {
				this.wwd.layers = layers.addLayer(this.wwd.layers, layer, 0);
			});
		} else if (noBackgroundLayer || removeBackgroundLayer){
			//if no layers, than add colored layer
			const earthBlueColor = '#6fafdc';
			// const layer = layers.getLayerByType({type:'colored', color: earthBlueColor});
			const layerData = {type:'colored', key: 'colored'};
			this.wwd.layers = layers.addLayer(this.wwd.layers, layerData, 0);
		}
		
	}

	handleLayers(nextLayersData = [], layersVectorData) {
		let nextLayers = [];
		nextLayersData.forEach(layerData => {
			let existingLayer = layers.findLayerByKey(this.wwd, layerData.key);
			if (existingLayer){
				nextLayers.push(existingLayer);
			} else {
				if(layerData.type === 'vector') {
					//FIXME - prevent load more times
					//add loading info
					const layersVectorDataLaded = layersVectorData && layerData && layerData.spatialRelationsData && layersVectorData[layerData.key];					
					if(!layersVectorDataLaded) {
						this.props.loadLayerData(layerData);
					}
				}
				let layer = layers.getLayerByType(layerData);
				if (layer){
					nextLayers.push(layer);
				}
			}
		});
		// add background layer
		if (this.props.backgroundLayer) {
			let backgroundLayer = this.wwd.layers.slice(0, this.props.backgroundLayer.length);
			nextLayers = [...backgroundLayer, ...nextLayers];
		}

		// if no background layers, then check if map conteins colored layer
		const coloredLayer = layers.findLayerByKey(this.wwd, 'colored');
		if (coloredLayer) {
			nextLayers = [coloredLayer, ...nextLayers];
		}

		this.wwd.layers = nextLayers;
		this.wwd.redraw();
	}

	handleVectorData(LayersData = [], layersVectorData = {}) {
		for (const [key, data] of Object.entries(layersVectorData)) {
			const layer = LayersData.find(l => l.key === key);
			let existingLayer = layers.findLayerByKey(this.wwd, key);

			if(existingLayer && existingLayer instanceof ExtendedRenderableLayer) {
				if(data && data.length > 0) {
					const dataSourceData = data.find(statialData => statialData.spatialDataSourceKey === layer.spatialRelationsData.spatialDataSourceKey);
					//merge with attributes
					existingLayer.setRenderables(dataSourceData.spatialData, defaultVectorStyle);
				} else {
					//Data are empty, set empty GoeJSON as renderable
					const emptyGeoJSON = {
						"type": "FeatureCollection",
						"features": []
					}
					existingLayer.setRenderables(emptyGeoJSON);
				}
			}
		}
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
				const elevation = new ElevationModel();
				elevation.removeAllCoverages();
				return elevation;
		}
	}

	onNavigatorChange(event) {
		if (event && event.worldWindow) {
			//setActive mapKey
			const changedNavigatorParams = navigator.getChangedParams(this.props.navigator, event.worldWindow.navigator);
			if (!_.isEmpty(changedNavigatorParams) && this.props.setActiveMapKey) {
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
