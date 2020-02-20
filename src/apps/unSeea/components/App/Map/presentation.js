import React from 'react';
import PropTypes from 'prop-types';
import {isEqual, isNull, cloneDeep, isEmpty, includes} from 'lodash';

import layersHelper from '../../../../../components/common/maps/Deprecated_WorldWindMap/layers/helpers';
import {getStaticDistrictsStyleFunction} from './staticPolygonStyle';
import {getStaticTreesStyleFunction} from './staticTreesPointStyle';
import {getCartogramStyleFunction} from '../../../../../components/common/maps/Deprecated_WorldWindMap/styles/cartogram';

import ExtendedRenderableLayer from '../../../../../components/common/maps/Deprecated_WorldWindMap/layers/VectorLayer';
import CartodiagramVectorLayer from '../../../../../components/common/maps/Deprecated_WorldWindMap/layers/CartodiagramVectorLayer';
import {defaultVectorStyle} from "../../../../../components/common/maps/Deprecated_WorldWindMap/layers/utils/vectorStyle";

import WorldWindMap from "../../../../../components/common/maps/Deprecated_WorldWindMap/presentation";
import _ from "lodash";

import {Context} from "@gisatcz/ptr-core";
const HoverContext = Context.getContext('HoverContext');

class UnSeeaWorldWindMap extends React.PureComponent {
	static contextType = HoverContext;

	static propTypes = {
		nameData: PropTypes.object,
		layersTreeLoaded: PropTypes.bool,
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
		setSelected: PropTypes.func,
		delayedWorldWindNavigatorSync: PropTypes.number,

		//specific
		vectorLayerStyleKey: PropTypes.string
	};

	constructor(props) {
		super(props);

		this.setRerenderer = this.setRerenderer.bind(this);
		this.onHover = this.onHover.bind(this);
		this.onMapClick = this.onMapClick.bind(this);
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

		if(this.props.selectedItems) {
			//filter vector layers
			this.setSelectedItems(thematicLayers, this.props.selectedItems);
		}

		//check if new data comes
		//todo check if layer already in map
		if (this.props.layersVectorData) {
			const layers = this.props.layers || [];
			this.handleVectorData(layers, this.props.layersVectorData, this.props.layersAttributeData, this.props.layersMetadata, [...backgroundLayers, ...thematicLayers], this.props.nameData);
			this.setStyleFunction(this.props.vectorLayerStyleKey, this.props.layersVectorData, [...backgroundLayers, ...thematicLayers], this.props.layersAttributeStatistics, this.props.layersMetadata)
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
				this.handleVectorData(layers, this.props.layersVectorData, this.props.layersAttributeData, this.props.layersMetadata, [...this.state.backgroundLayers, ...this.state.thematicLayers], this.props.nameData);
			}

			//check if new attribute statistics data comes
			const nameDataChanged = !isEqual(prevProps.nameData, this.props.nameData);
			if (nameDataChanged) {
				const layers = this.props.layers || [];
				this.handleVectorData(layers, this.props.layersVectorData, this.props.layersAttributeData, this.props.layersMetadata, [...this.state.backgroundLayers, ...this.state.thematicLayers], this.props.nameData);
			}

			if(backgroundLayersChanged && !isEqual(this.state.backgroundLayers, backgroundLayers)) {
				this.setState({backgroundLayers});
			}

			if(!isEqual(this.props.selectedItems, prevProps.selectedItems)) {
				//filter vector layers
				this.setSelectedItems(this.state.thematicLayers, this.props.selectedItems);
			}

			// todo refactor
			if (this.state.thematicLayers && this.context && this.context.hoveredItems !== this.hoveredItems) {
				this.setHover(this.state.thematicLayers, this.context.hoveredItems);
				this.hoveredItems = this.context.hoveredItems;
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
				const metadata = layersMetadata && layersMetadata[layerData.key];
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

	setStyleFunction(vectorLayerStyleKey, layersVectorData = {}, layersState = [], layersAttributeStatistics = {}, layersMetadata = {}) {
		
		for (const [key, data] of Object.entries(layersVectorData)) {
			let existingLayer = layersHelper.findLayerByKey(layersState, key);
			const instanceOfVector = existingLayer && (existingLayer instanceof ExtendedRenderableLayer);

			if(instanceOfVector) {
				//set layerstyle
				switch(vectorLayerStyleKey) {
					case 'districts':
							existingLayer.setStyleFunction(getStaticDistrictsStyleFunction('#FFF', 50, '#000', 255, 3));
							break;
					case 'districtsChoroplet':
							const statistics = {
								min: 0,
								max: 4,
								percentile: [0,1,2,3,4]
							}
							existingLayer.setStyleFunction(getCartogramStyleFunction('#ca4466', 150, statistics, 'GREEN_GRAY'));
							break;
					case 'trees':
							existingLayer.setStyleFunction(getStaticTreesStyleFunction('#FFF', 50, '#000', 255, 3));
							break;
				}
			}
		}
	}

	/**
	 * 
	 * @param {Array} LayersData 
	 * @param {Object} layersVectorData 
	 * @param {Array} layersState 
	 * 
	 * Join spatial vector data with map layers.
	 */
	handleVectorData(LayersData = [], layersVectorData = {}, layersAttributeData = {}, layersMetadata = {}, layersState = [], nameData = {}) {
		let hoveredItems = this.context.hoveredItems;

		for (const [key, data] of Object.entries(layersVectorData)) {
			const layer = LayersData.find(l => l.key === key);
			let existingLayer = layersHelper.findLayerByKey(layersState, key);
			// const instanceOfVector = existingLayer && (existingLayer instanceof CartogramVectorLayer || existingLayer instanceof CartodiagramVectorLayer);
			// const metadata = layersMetadata[key];
			const instanceOfVector = existingLayer && (existingLayer instanceof ExtendedRenderableLayer);

			// if(instanceOfVector && layersAttributeData[key] && metadata) {
			if(instanceOfVector) {
				if(data && data.length > 0) {
					const spatialDataSourceData = data.find(statialData => statialData.spatialDataSourceKey === layer.spatialRelationsData.spatialDataSourceKey);
					// const attributeDataSourceData = layersAttributeData[key].find(attributeData => attributeData.attributeDataSourceKey === layer.attributeRelationsData.attributeDataSourceKey).attributeData.features;
					//merge with attributes
					const fl = spatialDataSourceData.spatialData.features.length;

					//clone to prevent modify features in state
					const spatialData = cloneDeep(spatialDataSourceData.spatialData);
					for(let i = 0; i < fl; i++) {
						const feature = spatialData.features[i];
						const featureId = feature.properties[data.fidColumnName];

						// hovered
						if (hoveredItems && includes(hoveredItems, featureId)) {
							feature.properties.hovered = true;
						}
					}

					existingLayer.setRenderables(spatialData, defaultVectorStyle, null);

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

	setHover(layers, areas) {
		layers.forEach(layer => {
			let existingLayer = layersHelper.findLayerByKey(layers, layer.key);
			const instanceOfVector = existingLayer && (existingLayer instanceof ExtendedRenderableLayer);
			if(instanceOfVector) {
				existingLayer.setHover(areas);
			}
		})
	}

	setSelectedItems(layers, areas) {
		layers.forEach(layer => {
			let existingLayer = layersHelper.findLayerByKey(layers, layer.key);
			const instanceOfVector = existingLayer && (existingLayer instanceof ExtendedRenderableLayer);
			if(instanceOfVector) {
				existingLayer.setSelected(areas);
			}
		})
	}

	onMapClick(renderables, x, y, mapKey) {

		let features = renderables.map(renderable => renderable.userObject.userProperties);
		const keySource = this.props.activeMapAttributeKey;
		let keys = features.map(feature => feature[keySource]);
		const action = {};
		//add renderable to selected features
		this.props.setSelected(keys);

	}

	// TODO refactor
	onHover(renderables, x, y, showPopup = true, mapKey) {
		let features = renderables.map(renderable => renderable.userObject.userProperties);
		if (this.state.thematicLayers) {
			this.state.thematicLayers.forEach(layer => {
				let existingLayer = layersHelper.findLayerByKey(this.state.thematicLayers, layer.key);
				const instanceOfVector = existingLayer && (existingLayer instanceof ExtendedRenderableLayer);
				if(instanceOfVector) {
					let keySource = existingLayer.spatialIdKey;
					let nameSource = existingLayer.attributeIdKey;
					let valueSource = existingLayer.metadata && existingLayer.metadata.attributeDataKey;
					
					if(this.props.activeFilter) {
						features = features.filter((feature) => this.props.activeFilter.data.areas.includes(feature[keySource]))
					}

					let keys = features.map(feature => feature[keySource]);

					if (this.context && this.context.onHover && keys && keys.length > 0) {
						const action = {};
						if(showPopup) {
							action['popup'] = {
								x,
								y,
								content: this.getPopupContent(features, nameSource, valueSource, keySource)
							}
						}
						this.context.onHover(keys, action);
					}
				}
			});
		}
	}

	getPopupContent(features, nameSource = "name", valueSource, spatialIdSource) {
		if (features && features.length) {
			let content = [];
			features.forEach((feature) => {
				let unit = 'District';
				let name = _.get(feature, '_name');
				let value = feature.name;
				let spatialId = _.get(feature, spatialIdSource);
			
				if(spatialId || spatialId === 0) {
					switch(this.props.vectorLayerStyleKey) {
						case 'districts':
								content.push(<div key={spatialId}><i>{name || unit}:</i> {value || value === 0 ? value.toLocaleString() : null}</div>);
								break;
						case 'districtsChoroplet':
								let greenGrayValue = feature.GREEN_GRAY;
								content.push(<div key={spatialId}><i>{name || unit}:</i> {value || value === 0 ? value.toLocaleString() : null}</div>);
								content.push(<div key={`${spatialId}_green_gray`}><i>Green vs gray index:</i> {greenGrayValue || value === 0 ? greenGrayValue.toLocaleString() : null}</div>);
								break;
						case 'trees':
								content.push(<div key={spatialId}><i>Tree ID:</i> {spatialId}</div>);
								break;
					}
				} else {
					content.push(<div key={spatialId}>No data</div>);
				}
			});

			return (<>{content}</>)
		} else {
			return null;
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
		return (<WorldWindMap
			{...this.props} 
			layers={[...this.state.backgroundLayers, ...this.state.thematicLayers]}
			label={this.props.label}
			rerendererSetter={this.setRerenderer}
			onHover={this.onHover}
			onHoverOut={this.onHoverOut}
			onClick={this.onMapClick}
			/>);

	}
}

export default UnSeeaWorldWindMap;
