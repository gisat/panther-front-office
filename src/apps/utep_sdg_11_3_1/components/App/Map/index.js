import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../../../state/Action";

import {cloneDeep, isEqual} from 'lodash';

import wrapper from '../../../../../components/common/maps/Deprecated_MapWrapper';

import utils from '../../../../../utils/utils';
import { quartilePercentiles, mergeAttributeStatistics } from '../../../../../utils/statistics';

const useActiveMetadataKeys = {
	scope: false,
	attribute: false,
	period: true
};

const mapStateToProps = (state, props) => {
	let namesFilter = {};
	let filter = {};
	let chartCfg = {};

	return (state) => {
		let layersState = Select.maps.getLayersStateByMapKey_deprecated(state, props.mapKey, useActiveMetadataKeys);
		let layersData = layersState ? layersState.map(layer => {
			const filter = cloneDeep(layer.mergedFilter)
			return {filter, data: layer.layer}
		}) : null;
		let layers = Select.maps.getLayers_deprecated(state, layersData);
		layers.forEach((l) => {
			if(l.type === 'vector') {
				l.spatialIdKey = "gid"
			}
		})
		let vectorLayers = layers ? layers.filter((layerData) => layerData.type === 'vector') : [];
		// let activeFilter = Select.selections.getActive(state);

		//TODO -> select
		//active indicator type absolute/relative
		// let activeIndicatorKey = Select.components.get(state, 'esponFuore_IndicatorSelect', 'activeIndicator');
		// let activeIndicator = Select.specific.esponFuoreIndicators.getByKey(state, activeIndicatorKey);
		// const indicatorData = activeIndicator ? activeIndicator.data.type : 'relative';
		// const hueColor = '#00ff2b'; //green
		// const hueColor = '#4689d0'; //blue
		// const hueColor = '#ff0000'; //red
		
		const map = Select.maps.getMapByKey(state, props.mapKey);
		let label = null;
		if(map && map.data && map.data.metadataModifiers && map.data.metadataModifiers.period) {
			const periodKey = map.data.metadataModifiers.period;
			label = periodKey ? periodKey : null
		}

		let layersVectorData = vectorLayers.reduce((acc, layerData) => {
			if(layerData.spatialRelationsData) {
				const spatialDataSourceFilter = {
					spatialDataSourceKey: layerData.spatialRelationsData.spatialDataSourceKey,
					// fidColumnName: layerData.spatialRelationsData.fidColumnName
				};

				acc[layerData.key] = Select.spatialDataSources.vector.getBatchByFilterOrder(state, spatialDataSourceFilter, null);
				if (acc[layerData.key]) {
					acc[layerData.key]['fidColumnName'] = layerData.spatialRelationsData.fidColumnName;
				}
			}
			return acc
		}, {});
		
		// let layersAttributeData = vectorLayers.reduce((acc, layerData) => {
		// 	if(layerData.attributeRelationsData) {
		// 		const attributeDataSourceFilter = {
		// 			attributeDataSourceKey: {in: [layerData.attributeRelationsData.attributeDataSourceKey]},
		// 			fidColumnName: layerData.attributeRelationsData.fidColumnName
		// 		};

		// 		acc[layerData.key] = Select.attributeData.getBatchByFilterOrder(state, attributeDataSourceFilter, null);
		// 	}
		// 	return acc
		// }, {});
		
		// let layersMetadata = vectorLayers.reduce((acc, layerData) => {
		// 	if(layerData.attributeRelationsData) {
		// 		const attributeDataSource = Select.attributeDataSources.getByKeys(state, [layerData.attributeRelationsData.attributeDataSourceKey]);
		// 		//wait for attributeDataSource, otherwise attributeDataKey is null
		// 		if(attributeDataSource) {
		// 			const attributeDataKey = attributeDataSource && attributeDataSource[0] ? attributeDataSource[0].data.columnName : null;
		// 			const attributeKey = layerData.attributeRelationsData.attributeKey;
		// 			const attribute = Select.attributes.getByKey(state, attributeKey);
		// 			acc[layerData.key] = {
		// 				dataType: indicatorData,
		// 				attributeDataKey,
		// 				color: attribute &&  attribute.data && attribute.data.color ? attribute.data.color : hueColor,
		// 			}
		// 		}
		// 	}
		// 	return acc
		// }, {});


		// 
		// Statistics
		// 

		//merged statistics by layertemplateKey for cartodiagrams
		// const statisticsByLayerTemplateKeys = getStatisticsByLayerTemplateKeys(state, props);
		
		// let layersAttributeStatistics = vectorLayers.reduce((acc, layerData) => {
		// 	if(layerData.attributeRelationsData) {
		// 		const layer = statisticsByLayerTemplateKeys.find(l => l.key === layerData.attributeRelationsData.layerTemplateKey);
		// 		acc[layerData.key] = layer ? layer.mergedStatistics : null;
		// 	}
		// 	return acc
		// }, {});

		// let namesForVectorLayers = getNamesByLayerTemplateKeys(state, props, namesFilter, chartCfg)		
		// let vectorLayersNames = vectorLayers.reduce((acc, layerData) => {
		// 	if(layerData.attributeRelationsData) {
		// 		const layer = namesForVectorLayers[layerData.attributeRelationsData.layerTemplateKey];
		// 		acc[layerData.key] = layer || null;
		// 	}
		// 	return acc
		// }, {});

		return {
			layersTreeLoaded: true,
			activeFilter: null,
			backgroundLayer: [{type:'wikimedia'}],
			layers,
			layersVectorData,
			layersAttributeData: null,
			layersAttributeStatistics: {},
			layersMetadata: {},
			navigator: Select.maps.getNavigator_deprecated(state, props.mapKey),
			// activeAttributeKey: Select.attributes.getActiveKey(state),
			label: label || null,
			// nameData: vectorLayersNames,
			nameData: null,
		}
	}
};

const mapDispatchToProps = (dispatch, props) => {
	const componentId = 'WorldWindMapSelector_' + utils.randomString(6);

	return {
		onMount: () => {},

		onUnmount: () => {},

		onWorldWindNavigatorChange: (updates) => {
			dispatch(Action.maps.deprecated_updateWorldWindNavigator(props.mapKey, updates));
		},

		setActiveMapKey: () => {
			dispatch(Action.maps.setActiveMapKey(props.mapKey));
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(wrapper);
