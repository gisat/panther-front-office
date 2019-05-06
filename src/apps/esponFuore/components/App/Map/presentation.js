import React from 'react';
import PropTypes from 'prop-types';
import {isEqual, isNull, cloneDeep} from 'lodash';

import layersHelper from '../../../../../components/common/maps/WorldWindMap/layers/helpers';

import ExtendedRenderableLayer from '../../../../../components/common/maps/WorldWindMap/layers/ExtendedGeoJsonLayer';
import {defaultVectorStyle} from "../../../../../components/common/maps/WorldWindMap/layers/utils/vectorStyle";

import WorldWindMap from "../../../../../components/common/maps/WorldWindMap/presentation";

class FuoreWorldWindMap extends React.PureComponent {

	static propTypes = {
		backgroundLayer: PropTypes.array,
		elevationModel: PropTypes.string,
		layers: PropTypes.array,
		layersVectorData: PropTypes.object,
		layersAttributeData: PropTypes.object,
		layersAttributeStatistics: PropTypes.object,
		navigator: PropTypes.object,
		mapKey: PropTypes.string,
		onWorldWindNavigatorChange: PropTypes.func,
		setActiveMapKey: PropTypes.func,
		delayedWorldWindNavigatorSync: PropTypes.number,
		loadLayerData: PropTypes.func,
	};

	constructor(props) {
		super(props);

		this.state = {
			thematicLayers: [],
			backgroundLayers: [],
		};
	}

	componentDidMount() {
		let thematicLayers = [];
		const backgroundLayers = this.handleBackgroundLayers(null, this.props.backgroundLayer, this.state.backgroundLayers);

		if (this.props.layers || this.props.layers === null) {
			const layers = this.props.layers || [];
			thematicLayers = this.handleLayers(layers, this.props.layersVectorData);
		}


		//check if new data comes
		//todo check if layer already in map
		if (this.props.layersVectorData) {
			const layers = this.props.layers || [];
			this.handleVectorData(layers, this.props.layersVectorData, this.props.layersAttributeData, this.props.layersAttributeStatistics, [...backgroundLayers, ...thematicLayers]);
		}

		this.setState({
			thematicLayers: thematicLayers || [],
			backgroundLayers
		});
}

	componentDidUpdate(prevProps) {
		if (prevProps) {
			let thematicLayers = [], backgroundLayers = [];

			const backgroundLayersChanged = !isEqual(prevProps.backgroundLayer, this.props.backgroundLayer);
			if (backgroundLayersChanged) {
				backgroundLayers = this.handleBackgroundLayers(prevProps.backgroundLayer, this.props.backgroundLayer, this.state.backgroundLayers);
			}

			const thematicLayersChanged = !isEqual(prevProps.layers, this.props.layers);
			if (thematicLayersChanged) {
				const layers = this.props.layers || [];
				thematicLayers = this.handleLayers(layers, this.props.layersVectorData);
			}

			//check if new data comes
			//todo check if layer already in map
			if (!isEqual(prevProps.layersVectorData, this.props.layersVectorData)) {
				const layers = this.props.layers || [];
				this.handleVectorData(layers, this.props.layersVectorData, this.props.layersAttributeData, this.props.layersAttributeStatistics, [...this.state.backgroundLayers, ...this.state.thematicLayers]);
			}

			if(backgroundLayersChanged && !isEqual(this.state.backgroundLayers, backgroundLayers)) {
				this.setState({backgroundLayers});
			}

			if(thematicLayersChanged && !isEqual(this.state.thematicLayers, thematicLayers)) {
				this.setState({thematicLayers});
			}
		}
	}

	handleBackgroundLayers(prevLayerData, nextLayerData, stateLayers = []) {
		const newBackgroundLayer = isNull(prevLayerData) && !isNull(nextLayerData);
		const removeBackgroundLayer = !isNull(prevLayerData) && isNull(nextLayerData);
		const changedBackgroundLayer = !isNull(prevLayerData) && !isNull(nextLayerData) && !isEqual(prevLayerData, nextLayerData);
		const noBackgroundLayer = isNull(prevLayerData) && isNull(nextLayerData);

		let changedLayers = stateLayers;

		// Clear section
		if (newBackgroundLayer) {
			//try to remove colored layer
			changedLayers = layersHelper.removeLayer(changedLayers, 'colored');

		} else if(removeBackgroundLayer || changedBackgroundLayer) {
			prevLayerData.forEach(layer => {
				changedLayers = layersHelper.removeLayer(changedLayers, layer.key);
			});
		}

		//Add section
		if (newBackgroundLayer || changedBackgroundLayer) {
			nextLayerData.forEach(layer => {
				changedLayers = layersHelper.addLayer(changedLayers, layer, 0);
			});
		} else if (noBackgroundLayer || removeBackgroundLayer){
			//if no layers, than add colored layer
			const earthBlueColor = '#6fafdc';
			// const layer = layersHelper.getLayerByType({type:'colored', color: earthBlueColor});
			const layerData = {type:'colored', key: 'colored'};
			changedLayers = layersHelper.addLayer(changedLayers, layerData, 0);
		}

		return changedLayers;
		
	}

	handleLayers(nextLayersData = [], layersVectorData) {
		let changedLayers = [];
		nextLayersData.forEach(layerData => {
			let existingLayer = layersHelper.findLayerByKey(changedLayers, layerData.key);
			if (existingLayer){
				changedLayers.push(existingLayer);
			} else {
				if(layerData.type === 'vector') {
					//FIXME - prevent load more times
					//add loading info
					const layersVectorDataLaded = layersVectorData && layerData && layerData.spatialRelationsData && layersVectorData[layerData.key];					
					if(!layersVectorDataLaded) {
						this.props.loadLayerData(layerData);
					}
				}
				let layer = layersHelper.getLayerByType(layerData);
				if (layer){
					changedLayers.push(layer);
				}
			}
		});

		return changedLayers;
	}

	/**
	 * 
	 * @param {Array} LayersData 
	 * @param {Object} layersVectorData 
	 * @param {Array} layersState 
	 * 
	 * Join spatial vector data with map layers.
	 */
	handleVectorData(LayersData = [], layersVectorData = {}, layersAttributeData = {},layersAttributeStatistics = {}, layersState = []) {
		for (const [key, data] of Object.entries(layersVectorData)) {
			const layer = LayersData.find(l => l.key === key);
			let existingLayer = layersHelper.findLayerByKey(layersState, key);

			if(layersAttributeData.length && layersAttributeStatistics.length && existingLayer && existingLayer instanceof ExtendedRenderableLayer) {
				if(data && data.length > 0) {
					const spatialDataSourceData = data.find(statialData => statialData.spatialDataSourceKey === layer.spatialRelationsData.spatialDataSourceKey);
					const attributeDataSourceData = layersAttributeData[key].find(attributeData => attributeData.attributeDataSourceKey === layer.attributeRelationsData.attributeDataSourceKey).attributeData.features;
					const attributeStatisticsData = layersAttributeStatistics[key].find(attributeData => attributeData.attributeDataSourceKey === layer.attributeRelationsData.attributeDataSourceKey).attributeStatistic;
					//merge with attributes
					const fl = spatialDataSourceData.spatialData.features.length;

					//clone to prevent modify features in state
					const spatialData = cloneDeep(spatialDataSourceData.spatialData);
					for(let i = 0; i < fl; i++) {
						const feature = spatialData.features[i];
						const featureId = feature.properties[data.fidColumnName];
					
						
						//get attribute by value
						// attributes
						const attributeFeatureData = attributeDataSourceData.find((ad) => ad.properties[data.fidColumnName] === featureId);
						feature.properties = {...feature.properties, ...attributeFeatureData.properties};
					}

					existingLayer.setRenderables(spatialData, defaultVectorStyle);

					if(attributeStatisticsData) {
						existingLayer.setAttributeStatistics(attributeStatisticsData);
					}
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

	render() {
		return (<WorldWindMap {...this.props} layers={[...this.state.backgroundLayers, ...this.state.thematicLayers]}  />);

	}
}

export default FuoreWorldWindMap;
