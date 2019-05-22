import React from 'react';
import PropTypes from 'prop-types';
import {isEqual, isNull, cloneDeep, isEmpty, includes} from 'lodash';

import layersHelper from '../../../../../components/common/maps/WorldWindMap/layers/helpers';
import {getCartogramStyleFunction} from '../../../../../components/common/maps/WorldWindMap/styles/cartogram';
import {getCartodiagramStyleFunction} from '../../../../../components/common/maps/WorldWindMap/styles/cartodiagram';

import ExtendedRenderableLayer from '../../../../../components/common/maps/WorldWindMap/layers/ExtendedGeoJsonLayer';
import { DEFAULTFILLTRANSPARENCY } from '../../../../../components/common/maps/WorldWindMap/styles/colors'
import CartodiagramVectorLayer from '../../../../../components/common/maps/WorldWindMap/layers/CartodiagramVectorLayer';
import CartogramVectorLayer from '../../../../../components/common/maps/WorldWindMap/layers/CartogramVectorLayer';
import {defaultVectorStyle} from "../../../../../components/common/maps/WorldWindMap/layers/utils/vectorStyle";

import WorldWindMap from "../../../../../components/common/maps/WorldWindMap/presentation";
import HoverContext from "../../../../../components/common/HoverHandler/context";

class FuoreWorldWindMap extends React.PureComponent {
	static contextType = HoverContext;

	static propTypes = {
		activeFilter: PropTypes.object,
		backgroundLayer: PropTypes.array,
		elevationModel: PropTypes.string,
		label: PropTypes.string,
		layers: PropTypes.array,
		layersVectorData: PropTypes.object,
		layersAttributeData: PropTypes.object,
		layersAttributeStatistics: PropTypes.object,
		layersMetadata: PropTypes.object,
		navigator: PropTypes.object,
		mapKey: PropTypes.string,
		onWorldWindNavigatorChange: PropTypes.func,
		setActiveMapKey: PropTypes.func,
		delayedWorldWindNavigatorSync: PropTypes.number,
	};

	constructor(props) {
		super(props);

		this.setRerenderer = this.setRerenderer.bind(this);
		this.onHover = this.onHover.bind(this);
		this.onHoverOut = this.onHoverOut.bind(this);

		this.wwdRerenderer = null;

		this.state = {
			thematicLayers: [],
			backgroundLayers: [],
		};
	}

	componentDidMount() {
		let thematicLayers = [];
		const backgroundLayers = this.handleBackgroundLayers(null, this.props.backgroundLayer, this.state.backgroundLayers);

		if (this.props.layers || this.props.layers === null && this.props.layersMetadata) {
			const layers = this.props.layers || [];
			thematicLayers = this.handleLayers(layers, this.props.layersMetadata);
		}


		//check if new data comes
		//todo check if layer already in map
		if (this.props.layersVectorData) {
			const layers = this.props.layers || [];
			this.handleVectorData(layers, this.props.layersVectorData, this.props.layersAttributeData, this.props.layersAttributeStatistics, this.props.layersMetadata, [...backgroundLayers, ...thematicLayers]);
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

			let thematicLayersChanged = !isEqual(prevProps.layers, this.props.layers);
			if (thematicLayersChanged && !isEmpty(this.props.layersMetadata)) {
				const layers = this.props.layers || [];
				thematicLayers = this.handleLayers(layers, this.props.layersMetadata);
			}

			//check if new data comes
			//todo check if layer already in map
			const layersVectorDataChanged = !isEqual(prevProps.layersVectorData, this.props.layersVectorData);
			if (layersVectorDataChanged) {
				const layers = this.props.layers || [];
				this.handleVectorData(layers, this.props.layersVectorData, this.props.layersAttributeData, this.props.layersAttributeStatistics, this.props.layersMetadata, [...this.state.backgroundLayers, ...this.state.thematicLayers]);
			}

			//check if new attribute data comes
			const layersAttributeDataChanged = !isEqual(prevProps.layersAttributeData, this.props.layersAttributeData);
			if (layersAttributeDataChanged) {
				const layers = this.props.layers || [];
				this.handleVectorData(layers, this.props.layersVectorData, this.props.layersAttributeData, this.props.layersAttributeStatistics, this.props.layersMetadata, [...this.state.backgroundLayers, ...this.state.thematicLayers]);
			}

			//check if new attribute data comes
			const layersMetadataDataChanged = !isEqual(prevProps.layersMetadata, this.props.layersMetadata);
			if (layersMetadataDataChanged) {
				const layers = this.props.layers || [];
				thematicLayers = this.handleLayers(layers, this.props.layersMetadata);
				thematicLayersChanged = true;
			}

			//check if new attribute statistics data comes
			const layersAttributeStatisticsDataChanged = !isEqual(prevProps.layersAttributeStatistics, this.props.layersAttributeStatistics);
			if (layersAttributeStatisticsDataChanged) {
				const layers = this.props.layers || [];
				this.handleVectorData(layers, this.props.layersVectorData, this.props.layersAttributeData, this.props.layersAttributeStatistics, this.props.layersMetadata, [...this.state.backgroundLayers, ...this.state.thematicLayers]);
			}

			if(backgroundLayersChanged && !isEqual(this.state.backgroundLayers, backgroundLayers)) {
				this.setState({backgroundLayers});
			}

			if(!isEqual(this.props.activeFilter, prevProps.activeFilter)) {
				//filter vector layers
				this.setFilterVectorLayers(this.props.activeFilter, this.props.layers, [...this.state.backgroundLayers, ...this.state.thematicLayers]);
			}

			if(thematicLayersChanged && !isEqual(this.state.thematicLayers, thematicLayers)) {
				this.setState({thematicLayers});

				//if vector data comes before layer
				if(this.props.layersVectorData) {
					const layers = this.props.layers || [];
					this.handleVectorData(layers, this.props.layersVectorData, this.props.layersAttributeData, this.props.layersAttributeStatistics, this.props.layersMetadata, [...this.state.backgroundLayers, ...thematicLayers]);
				}

				const stateLayers = [...this.state.backgroundLayers, ...thematicLayers];
				if(this.props.activeFilter && stateLayers.length > 0) {
					this.setFilterVectorLayers(this.props.activeFilter, this.props.layers, stateLayers);
				}

			}

			// todo refactor
			if (this.state.thematicLayers && this.context && this.context.hoveredAreas !== this.hoveredAreas) {
				this.setHover(this.state.thematicLayers, this.context.hoveredAreas);
				this.hoveredAreas = this.context.hoveredAreas;
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

	handleLayers(nextLayersData = [], layersMetadata = {}) {
		let changedLayers = [];
		nextLayersData.forEach(layerData => {
			let existingLayer = layersHelper.findLayerByKey(changedLayers, layerData.key);
			if (existingLayer){
				changedLayers.push(existingLayer);
			} else {
				const metadata = layersMetadata[layerData.key];
				let type = layerData.type;
				if(layerData.type === 'vector' && metadata) {
					type = `${layerData.type}-${metadata.dataType}`
				}
				let layer = layersHelper.getLayerByType(layerData, type);
				if (layer){
					changedLayers.push(layer);

					if(typeof layer.setRerender === 'function') {
						layer.setRerender(this.wwdRerenderer);
					}
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
	handleVectorData(LayersData = [], layersVectorData = {}, layersAttributeData = {},layersAttributeStatistics = {}, layersMetadata = {}, layersState = []) {
		let hoveredAreas = this.context.hoveredAreas;

		for (const [key, data] of Object.entries(layersVectorData)) {
			const layer = LayersData.find(l => l.key === key);
			let existingLayer = layersHelper.findLayerByKey(layersState, key);
			const instanceOfVector = existingLayer && (existingLayer instanceof CartogramVectorLayer || existingLayer instanceof CartodiagramVectorLayer);
			if(instanceOfVector && layersAttributeData[key] && layersAttributeStatistics[key]) {
				if(data && data.length > 0) {
					const spatialDataSourceData = data.find(statialData => statialData.spatialDataSourceKey === layer.spatialRelationsData.spatialDataSourceKey);
					const attributeDataSourceData = layersAttributeData[key].find(attributeData => attributeData.attributeDataSourceKey === layer.attributeRelationsData.attributeDataSourceKey).attributeData.features;
					const attributeStatisticsData = layersAttributeStatistics[key];
					const metadata = layersMetadata[key];
					//merge with attributes
					const fl = spatialDataSourceData.spatialData.features.length;

					//clone to prevent modify features in state
					const spatialData = cloneDeep(spatialDataSourceData.spatialData);
					for(let i = 0; i < fl; i++) {
						const feature = spatialData.features[i];
						const featureId = feature.properties[data.fidColumnName];
					
						
						//get attribute by value
						const attributeFeatureData = attributeDataSourceData.find((ad) => ad.properties[layer.attributeRelationsData.fidColumnName] === featureId);
						if(attributeFeatureData){
							feature.properties = {...feature.properties, ...attributeFeatureData.properties};
						}

						// hovered
						if (hoveredAreas && includes(hoveredAreas, featureId)) {
							feature.properties.hovered = true;
						}
					}

					if(attributeStatisticsData) {
						existingLayer.setAttributeStatistics(attributeStatisticsData);
					}

					existingLayer.setRenderables(spatialData, defaultVectorStyle, metadata);

					if(metadata && metadata.attributeDataKey) {
						existingLayer.setMetadata(metadata);

						//set layerstyle
						if(metadata.dataType === 'relative') {
							//use merged statistics
							existingLayer.setStyleFunction(getCartogramStyleFunction(metadata.color, DEFAULTFILLTRANSPARENCY, attributeStatisticsData, metadata.attributeDataKey));
						} else if(metadata.dataType === 'absolute') {
							existingLayer.setStyleFunction(getCartodiagramStyleFunction(metadata.color, DEFAULTFILLTRANSPARENCY, attributeStatisticsData, metadata.attributeDataKey));
						}
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

	setFilterVectorLayers(filter, layers = [], layersState) {
		layers.forEach(layer => {
			let existingLayer = layersHelper.findLayerByKey(layersState, layer.key);
			const instanceOfVector = existingLayer && (existingLayer instanceof CartogramVectorLayer || existingLayer instanceof CartodiagramVectorLayer);
			if(instanceOfVector) {
				existingLayer.setFilter(filter ? filter.data : null);
			}
			if(existingLayer && (existingLayer instanceof CartodiagramVectorLayer)) {
				existingLayer.setAccent(filter ? filter.data : null);
			}
		})

	}

	setHover(layers, areas) {
		layers.forEach(layer => {
			let existingLayer = layersHelper.findLayerByKey(layers, layer.key);
			const instanceOfVector = existingLayer && (existingLayer instanceof CartogramVectorLayer || existingLayer instanceof CartodiagramVectorLayer);
			if(instanceOfVector) {
				existingLayer.setHover(areas);
			}
		})
	}

	onHover(renderables) {
		let features = renderables.map(renderable => renderable.userObject.userProperties);
		if (this.state.thematicLayers) {
			this.state.thematicLayers.forEach(layer => {
				let existingLayer = layersHelper.findLayerByKey(this.state.thematicLayers, layer.key);
				const instanceOfVector = existingLayer && (existingLayer instanceof CartogramVectorLayer || existingLayer instanceof CartodiagramVectorLayer);
				if(instanceOfVector) {
					let keySource = existingLayer.spatialIdKey;
					let keys = features.map(feature => feature[keySource]);
					if (this.context && this.context.onHover) {
						this.context.onHover(keys);
					}
				}
			});
		}
	}

	onHoverOut() {
		if (this.context && this.context.onHoverOut) {
			this.context.onHoverOut();
		}
	}

	setRerenderer(rerenderer) {
		if(typeof rerenderer === 'function') {
			this.wwdRerenderer = rerenderer;
		}
	}

	render() {
		return (<WorldWindMap {...this.props} layers={[...this.state.backgroundLayers, ...this.state.thematicLayers]} label={this.props.label}  rerendererSetter={this.setRerenderer} onHover={this.onHover} onHoverOut={this.onHoverOut} />);

	}
}

export default FuoreWorldWindMap;
