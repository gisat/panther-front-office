import React from 'react';
import PropTypes from 'prop-types';
import {isEqual, isNull, cloneDeep, isEmpty, includes} from 'lodash';

import layersHelper from '../../../../../components/common/maps/Deprecated_WorldWindMap/layers/helpers';
import {getCartogramStyleFunction} from '../../../../../components/common/maps/Deprecated_WorldWindMap/styles/cartogram';
import {getCartodiagramStyleFunction, MIN_DIAGRAM_RADIUS, MAX_DIAGRAM_RADIUS} from '../../../../../components/common/maps/Deprecated_WorldWindMap/styles/cartodiagram';

import ExtendedRenderableLayer from '../../../../../components/common/maps/Deprecated_WorldWindMap/layers/ExtendedGeoJsonLayer';
import { DEFAULTFILLTRANSPARENCY } from '../../../../../components/common/maps/Deprecated_WorldWindMap/styles/colors'
import CartodiagramVectorLayer from '../../../../../components/common/maps/Deprecated_WorldWindMap/layers/CartodiagramVectorLayer';
import CartogramVectorLayer from '../../../../../components/common/maps/Deprecated_WorldWindMap/layers/CartogramVectorLayer';
import {defaultVectorStyle} from "../../../../../components/common/maps/Deprecated_WorldWindMap/layers/utils/vectorStyle";

import WorldWindMap from "../../../../../components/common/maps/Deprecated_WorldWindMap/presentation";
import HoverContext from "../../../../../components/common/HoverHandler/context";
import _ from "lodash";

import helpers from './download/helpers';

class FuoreWorldWindMap extends React.PureComponent {
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
			this.handleVectorData(layers, this.props.layersVectorData, this.props.layersAttributeData, this.props.layersMetadata, [...backgroundLayers, ...thematicLayers], this.props.nameData);
			this.setFilterVectorLayers(this.props.activeFilter, layers, [...backgroundLayers, ...thematicLayers]);
			this.setStyleFunction(this.props.layersVectorData, [...backgroundLayers, ...thematicLayers], this.props.layersAttributeStatistics, this.props.layersMetadata)
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
				this.setFilterVectorLayers(this.props.activeFilter, layers, [...this.state.backgroundLayers, ...this.state.thematicLayers]);
			}

			//check if new attribute data comes
			const layersAttributeDataChanged = !isEqual(prevProps.layersAttributeData, this.props.layersAttributeData);
			if (layersAttributeDataChanged) {
				const layers = this.props.layers || [];
				this.handleVectorData(layers, this.props.layersVectorData, this.props.layersAttributeData, this.props.layersMetadata, [...this.state.backgroundLayers, ...this.state.thematicLayers], this.props.nameData);
				this.setFilterVectorLayers(this.props.activeFilter, layers, [...this.state.backgroundLayers, ...this.state.thematicLayers]);
				this.setStyleFunction(this.props.layersVectorData, [...this.state.backgroundLayers, ...this.state.thematicLayers], this.props.layersAttributeStatistics, this.props.layersMetadata)
			}

			//check if new attribute data comes
			const layersMetadataDataChanged = !isEqual(prevProps.layersMetadata, this.props.layersMetadata);
			if (layersMetadataDataChanged) {
				const layers = this.props.layers || [];
				thematicLayersChanged = true;
				thematicLayers = this.handleLayers(layers, this.props.layersMetadata);
				
				this.handleMetadata(this.props.layersVectorData, [...this.state.backgroundLayers, ...this.state.thematicLayers], this.props.layersMetadata)
			}

			//check if new attribute statistics data comes
			const layersAttributeStatisticsDataChanged = !isEqual(prevProps.layersAttributeStatistics, this.props.layersAttributeStatistics);

			if (layersAttributeStatisticsDataChanged) {
				//set layer statistics
				this.handleStatistics(this.props.layersVectorData, [...this.state.backgroundLayers, ...this.state.thematicLayers], this.props.layersAttributeStatistics)
				//setstylefunction
				this.setStyleFunction(this.props.layersVectorData, [...this.state.backgroundLayers, ...this.state.thematicLayers], this.props.layersAttributeStatistics, this.props.layersMetadata)
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

			if(!isEqual(this.props.activeFilter, prevProps.activeFilter)) {
				//filter vector layers
				const layers = this.props.layers || [];
				this.setFilterVectorLayers(this.props.activeFilter, layers, [...this.state.backgroundLayers, ...this.state.thematicLayers]);
			}

			if(thematicLayersChanged && !isEqual(this.state.thematicLayers, thematicLayers)) {
				this.setState({thematicLayers});
				this.handleMetadata(this.props.layersVectorData, [...this.state.backgroundLayers, ...thematicLayers], this.props.layersMetadata)
				this.handleStatistics(this.props.layersVectorData, [...this.state.backgroundLayers, ...thematicLayers], this.props.layersAttributeStatistics)

				//if vector data comes before layer
				if(this.props.layersVectorData) {
					const layers = this.props.layers || [];
					this.handleVectorData(layers, this.props.layersVectorData, this.props.layersAttributeData, this.props.layersMetadata, [...this.state.backgroundLayers, ...thematicLayers], this.props.nameData);
					this.setFilterVectorLayers(this.props.activeFilter, layers, [...this.state.backgroundLayers, ...thematicLayers]);
					this.setStyleFunction(this.props.layersVectorData, [...this.state.backgroundLayers, ...thematicLayers], this.props.layersAttributeStatistics, this.props.layersMetadata)
				}
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

	handleStatistics(layersVectorData = {}, layersState = [], layersAttributeStatistics = {}) {

		for (const [key, data] of Object.entries(layersVectorData)) {
			let existingLayer = layersHelper.findLayerByKey(layersState, key);
			const instanceOfVector = existingLayer && (existingLayer instanceof CartogramVectorLayer || existingLayer instanceof CartodiagramVectorLayer);
			const layerStatistics = layersAttributeStatistics[key];

			if(instanceOfVector && layerStatistics) {
				existingLayer.setAttributeStatistics(layerStatistics);
			}

		}
	}

	setStyleFunction(layersVectorData = {}, layersState = [], layersAttributeStatistics = {}, layersMetadata = {}) {
		
		for (const [key, data] of Object.entries(layersVectorData)) {
			let existingLayer = layersHelper.findLayerByKey(layersState, key);
			const instanceOfVector = existingLayer && (existingLayer instanceof CartogramVectorLayer || existingLayer instanceof CartodiagramVectorLayer);
			const layerStatistics = layersAttributeStatistics[key];
			const metadata = layersMetadata[key];

			if(instanceOfVector && layerStatistics && metadata) {
				//set layerstyle
				if(metadata.dataType === 'relative') {
					existingLayer.setStyleFunction(getCartogramStyleFunction(metadata.color, DEFAULTFILLTRANSPARENCY, layerStatistics, metadata.attributeDataKey));
				} else if(metadata.dataType === 'absolute') {
					existingLayer.setStyleFunction(getCartodiagramStyleFunction(metadata.color, DEFAULTFILLTRANSPARENCY, layerStatistics, metadata.attributeDataKey, 'volume', true, MAX_DIAGRAM_RADIUS, MIN_DIAGRAM_RADIUS));
				}
			}
		}
	}

	handleMetadata(layersVectorData = {}, layersState = [], layersMetadata = {}) {
		for (const [key, data] of Object.entries(layersVectorData)) {
			let existingLayer = layersHelper.findLayerByKey(layersState, key);
			const instanceOfVector = existingLayer && (existingLayer instanceof CartogramVectorLayer || existingLayer instanceof CartodiagramVectorLayer);
			const metadata = layersMetadata[key];

			if(instanceOfVector && metadata && metadata.attributeDataKey) {
				existingLayer.setMetadata(metadata);
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
			const instanceOfVector = existingLayer && (existingLayer instanceof CartogramVectorLayer || existingLayer instanceof CartodiagramVectorLayer);
			const metadata = layersMetadata[key];

			if(instanceOfVector && layersAttributeData[key] && metadata) {
				if(data && data.length > 0) {
					const spatialDataSourceData = data.find(statialData => statialData.spatialDataSourceKey === layer.spatialRelationsData.spatialDataSourceKey);
					const attributeDataSourceData = layersAttributeData[key].find(attributeData => attributeData.attributeDataSourceKey === layer.attributeRelationsData.attributeDataSourceKey).attributeData.features;
					//merge with attributes
					const fl = spatialDataSourceData.spatialData.features.length;

					//clone to prevent modify features in state
					const spatialData = cloneDeep(spatialDataSourceData.spatialData);
					for(let i = 0; i < fl; i++) {
						const feature = spatialData.features[i];
						const featureId = feature.properties[data.fidColumnName];
					
						
						//get attribute by value
						const nameProperty = {};
						const attributeFeatureData = attributeDataSourceData.find((ad) => ad.properties[layer.attributeRelationsData.fidColumnName] === featureId);
						if(attributeFeatureData && nameData && nameData[key]) {
							const nameFeatureData = nameData[key].find((nd) => nd.key === attributeFeatureData.properties[layer.attributeRelationsData.fidColumnName]);
							nameProperty['_name'] = nameFeatureData.data.name;
						} else {
							console.warn("No attribute data found for feature", feature)
						}

						if(attributeFeatureData){
							feature.properties = {...feature.properties, ...attributeFeatureData.properties, ...nameProperty};
						}

						// hovered
						if (hoveredItems && includes(hoveredItems, featureId)) {
							feature.properties.hovered = true;
						}
					}
					if (existingLayer.renderables && existingLayer.renderables.length > 0) {
						// debugger //TODO
					}
					//musejí být statistiky!!
					existingLayer.setRenderables(spatialData, defaultVectorStyle, metadata);

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

	// TODO refactor
	onHover(renderables, x, y, showPopup = true) {
		let features = renderables.map(renderable => renderable.userObject.userProperties);
		if (this.state.thematicLayers) {
			this.state.thematicLayers.forEach(layer => {
				let existingLayer = layersHelper.findLayerByKey(this.state.thematicLayers, layer.key);
				const instanceOfVector = existingLayer && (existingLayer instanceof CartogramVectorLayer || existingLayer instanceof CartodiagramVectorLayer);
				if(instanceOfVector) {
					let keySource = existingLayer.spatialIdKey;
					let nameSource = existingLayer.attributeIdKey;
					let valueSource = existingLayer.metadata && existingLayer.metadata.attributeDataKey;
					
					if(this.props.activeFilter) {
						features = features.filter((feature) => this.props.activeFilter.data.filteredKeys.includes(feature[keySource]))
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

	getPopupContent(features, nameSource, valueSource, spatialIdSource) {
		if (features && features.length && nameSource && valueSource) {
			let content = [];
			features.forEach((feature) => {
				let unit = _.get(feature, nameSource);
				let name = _.get(feature, '_name');
				let value = _.get(feature, valueSource);
				let spatialId = _.get(feature, spatialIdSource);
				if(value || value === 0) {
					content.push(<div className="ptr-popup-header" key={spatialId}>{name || unit}</div>);
					content.push(<div key={spatialId + '-group'} className="ptr-popup-record-value-group">
						{value || value === 0 ? <span className="value">{value.toLocaleString()}</span> : null}
					</div>)
				} else {
					content.push(<div className="ptr-popup-header" key={spatialId}>No data</div>);
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
		return (
			<WorldWindMap
				{...this.props}
				layers={[...this.state.backgroundLayers, ...this.state.thematicLayers]}
				label={this.props.label}
				rerendererSetter={this.setRerenderer}
				onHover={this.onHover}
				onHoverOut={this.onHoverOut}
				onDownloadAsPng={helpers.downloadAsPng.bind(this)}
			/>
		);
	}
}

export default FuoreWorldWindMap;
