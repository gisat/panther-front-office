import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../../../state/Action";

import {cloneDeep, isEqual} from 'lodash';

import wrapper from '../../../../../components/common/maps/Deprecated_MapWrapper';

import utils from '../../../../../utils/utils';
import { quartilePercentiles, mergeAttributeStatistics } from '../../../../../utils/statistics';
import fuoreUtils from "../../../utils";

const useActiveMetadataKeys = {
	scope: true,
	attribute: true,
	period: true
};

let namesFilter = {};

const getNamesByLayerTemplateKeys = (state, props, namesFilter) => {
	const mapSet = Select.maps.getMapSetByMapKey(state, props.mapKey);

	const layersState = Select.maps.getLayersStateByMapSetKey_deprecated(state, mapSet.key);


	const mapSetsLayers = {};
	for (const [key, value] of Object.entries(layersState)) {
		if(value && value.length & value.length > 0) {
			const layersData = value.map((l) => {
				const filter = cloneDeep(l.mergedFilter);
				return {filter, data: l.layer};
			})
			mapSetsLayers[key] = Select.maps.getLayers_deprecated(state, layersData);
		}
	};

	const layersByLayerTemplateKey = {};
	for (const [mapKey, layers] of Object.entries(mapSetsLayers)) {
		if(layers) {
			for (const layer of layers) {
				const layerTemplateKey = layer.spatialRelationsData && layer.spatialRelationsData.layerTemplateKey;
				if(layerTemplateKey) {
					if(!layersByLayerTemplateKey[layerTemplateKey]) {
						layersByLayerTemplateKey[layerTemplateKey] = Select.charts.getNamesForChart(state, namesFilter, layerTemplateKey);
					}
				}
			}
		}
	}
	return layersByLayerTemplateKey;
}

//mostly similar to MapLegend
const getStatisticsByLayerTemplateKeys = (state, props) => {
	//get mapSetByMapKey
	const mapSet = Select.maps.getMapSetByMapKey(state, props.mapKey);

	const layersState = Select.maps.getLayersStateByMapSetKey_deprecated(state, mapSet.key);

	const mapSetsLayers = {};
	for (const [key, value] of Object.entries(layersState)) {
		if(value && value.length && value.length > 0) {
			const layersData = value.map((l) => {
				const filter = cloneDeep(l.mergedFilter);
				return {filter, data: l.layer};
			})
			mapSetsLayers[key] = Select.maps.getLayers_deprecated(state, layersData);
		}
	};

	const layersByLayerTemplateKey = {};
	
	for (const [mapKey, layers] of Object.entries(mapSetsLayers)) {
		if(layers) {
			for (const layer of layers) {
				const layerTemplateKey = layer.spatialRelationsData && layer.spatialRelationsData.layerTemplateKey;
				if(layerTemplateKey) {
					if(!layersByLayerTemplateKey[layerTemplateKey]) {
						layersByLayerTemplateKey[layerTemplateKey] = {};
						layersByLayerTemplateKey[layerTemplateKey] = {
							key: layerTemplateKey,
							type: layer.type,
							statistics: {},
							mergedStatistics: null,
							layers: {}
						};
					}
					layersByLayerTemplateKey[layerTemplateKey].layers[layer.key] = layer
				}
			}
		}
	}

	const vectorLayersByLayerTemplateKey = Object.values(layersByLayerTemplateKey).filter((l) => l.type === 'vector');

	//for each merged layers
	for (const layerByLayerTemplateKey of vectorLayersByLayerTemplateKey) {
			//get statistics for layertemplate
			layerByLayerTemplateKey.statistics = {};
		
			for (const [layerKey, layer] of Object.entries(layerByLayerTemplateKey.layers)) {
				if(layer.attributeRelationsData) {
					const attributeStatisticsFilter = {
						attributeDataSourceKey: {in: [layer.attributeRelationsData.attributeDataSourceKey]},
						percentile: quartilePercentiles,
					};
		
					const attributeStatistics = Select.attributeStatistics.getBatchByFilterOrder(state, attributeStatisticsFilter, null);
					layerByLayerTemplateKey.statistics[layerKey] = attributeStatistics && attributeStatistics[0] && attributeStatistics[0].attributeStatistic ? attributeStatistics[0] : null;

					if(layerByLayerTemplateKey.attributeKey !== layer.attributeRelationsData.attributeKey) {
						layerByLayerTemplateKey.attributeKey = layer.attributeRelationsData.attributeKey;
					};
				}
			}

			layerByLayerTemplateKey.mergedStatistics = mergeAttributeStatistics(Object.values(layerByLayerTemplateKey.statistics).filter(s => s));
	}

	return vectorLayersByLayerTemplateKey;
}

const mapStateToProps = (state, props) => {
	// let filter = {};
	let chartCfg = {};

	return (state) => {
		let activeScope = Select.scopes.getActive(state);
		let nameAttributeKey = activeScope && activeScope.data && activeScope.data.configuration && activeScope.data.configuration.areaNameAttributeKey;
		let currentNamesFilter= {scopeKey: activeScope && activeScope.key, attributeKey: nameAttributeKey};
		// let backgroundLayerState = Select.maps.getBackgroundLayerStateByMapKey_deprecated(state, props.mapKey);
		// let backgroundLayerData = backgroundLayerState ? [{filter: backgroundLayerState.mergedFilter, data: backgroundLayerState.layer}] : null;
		let layerTree = Select.layersTrees.getByFilterOrder(state, props.layerTreesFilter, null);

		// don't mutate selector input if it is not needed
		if (!isEqual(namesFilter, currentNamesFilter)){
			namesFilter = cloneDeep(currentNamesFilter);
		}

		let layersState = Select.maps.getLayersStateByMapKey_deprecated(state, props.mapKey, useActiveMetadataKeys);
		let layersData = layersState ? layersState.map(layer => {
			const filter = cloneDeep(layer.mergedFilter);
			return {filter, data: layer.layer}
		}) : null;
		let layers = Select.maps.getLayers_deprecated(state, layersData);
		let vectorLayers = layers ? layers.filter((layerData) => layerData.type === 'vector') : [];

		//TODO -> select
		//active indicator type absolute/relative
		let activeIndicatorKey = Select.components.get(state, 'esponFuore_IndicatorSelect', 'activeIndicator');
		let activeIndicator = Select.specific.esponFuoreIndicators.getByKey(state, activeIndicatorKey);
		
		const map = Select.maps.getMapByKey(state, props.mapKey);
		let label = null;
		let periodKey = null;
		if(map && map.data && map.data.metadataModifiers && map.data.metadataModifiers.period) {
			periodKey = map.data.metadataModifiers.period;
			const period = Select.periods.getDataByKey(state, periodKey);
			label = period ? period.nameDisplay : null;
		}

		let activeFilter = Select.specific.esponFuoreSelections.getActiveWithFilteredKeysByPeriod(state, periodKey);

		let layersVectorData = vectorLayers.reduce((acc, layerData) => {
			if(layerData.spatialRelationsData) {
				const spatialDataSourceFilter = {
					spatialDataSourceKey: layerData.spatialRelationsData.spatialDataSourceKey,
					fidColumnName: layerData.spatialRelationsData.fidColumnName
				};

				acc[layerData.key] = Select.spatialDataSources.vector.getBatchByFilterOrder(state, spatialDataSourceFilter, null);
				if (acc[layerData.key]) {
					acc[layerData.key]['fidColumnName'] = layerData.spatialRelationsData.fidColumnName;
				}
			}
			return acc
		}, {});
		
		let layersAttributeData = vectorLayers.reduce((acc, layerData) => {
			if(layerData.attributeRelationsData) {
				const attributeDataSourceFilter = {
					attributeDataSourceKey: {in: [layerData.attributeRelationsData.attributeDataSourceKey]},
					fidColumnName: layerData.attributeRelationsData.fidColumnName
				};

				acc[layerData.key] = Select.attributeData.getBatchByFilterOrder(state, attributeDataSourceFilter, null);
			}
			return acc
		}, {});
		
		let layersMetadata = vectorLayers.reduce((acc, layerData) => {
			if(layerData.attributeRelationsData) {
				const attributeDataSource = Select.attributeDataSources.getByKeys(state, [layerData.attributeRelationsData.attributeDataSourceKey]);
				//wait for attributeDataSource, otherwise attributeDataKey is null
				if(attributeDataSource) {
					const attributeDataKey = attributeDataSource && attributeDataSource[0] ? attributeDataSource[0].data.columnName : null;
					const attributeKey = layerData.attributeRelationsData.attributeKey;
					const attribute = Select.attributes.getByKey(state, attributeKey);

					acc[layerData.key] = {
						dataType: attribute &&  attribute.data && attribute.data.valueType,
						attributeDataKey,
						color: fuoreUtils.resolveColour(attribute),
						colors: [...fuoreUtils.resolveColours(attribute), '#ffffbf'], //#ffffbf - center color
						twoSideScale: attribute.data.twoSideScale === true,
					}
				}
			}
			return acc
		}, {});


		// 
		// Statistics
		// 

		//merged statistics by layertemplateKey for cartodiagrams
		const statisticsByLayerTemplateKeys = getStatisticsByLayerTemplateKeys(state, props);
		
		let layersAttributeStatistics = vectorLayers.reduce((acc, layerData) => {
			if(layerData.attributeRelationsData) {
				const layer = statisticsByLayerTemplateKeys.find(l => l.key === layerData.attributeRelationsData.layerTemplateKey);
				acc[layerData.key] = layer ? layer.mergedStatistics : null;
			}
			return acc
		}, {});

		let namesForVectorLayers = getNamesByLayerTemplateKeys(state, props, namesFilter);
		let vectorLayersNames = vectorLayers.reduce((acc, layerData) => {
			if(layerData.attributeRelationsData) {
				const layer = namesForVectorLayers[layerData.attributeRelationsData.layerTemplateKey];
				acc[layerData.key] = layer || null;
			}
			return acc
		}, {});

		return {
			// backgroundLayer: Select.maps.getLayers(state, backgroundLayerData),
			layersTreeLoaded: !!layerTree,
			activeFilter,
			layers,
			layersVectorData,
			layersAttributeData,
			layersAttributeStatistics,
			layersMetadata,
			navigator: Select.maps.getNavigator_deprecated(state, props.mapKey),
			activeAttribute: Select.attributes.getActive(state),
			activeScope: Select.scopes.getActive(state),
			activeMapSetKey: Select.maps.getActiveSetKey(state),
			label: label || null,
			nameData: vectorLayersNames,
		}
	}
};

const mapDispatchToProps = (dispatch, props) => {
	const componentId = 'WorldWindMapSelector_' + utils.randomString(6);

	return {
		onMount: () => {
			dispatch(Action.maps.deprecated_use(props.mapKey, useActiveMetadataKeys));
		},

		onUnmount: () => {
			dispatch(Action.maps.deprecated_useClear(props.mapKey));
			dispatch(Action.layersTrees.useIndexedClear(componentId));
			dispatch(Action.attributeData.useIndexedClear(componentId));
			dispatch(Action.spatialDataSources.vector.useIndexedClear(componentId));

			//FIXME - clear spatial, attributes data, relations...
		},

		onWorldWindNavigatorChange: (updates) => {
			dispatch(Action.maps.deprecated_updateWorldWindNavigator(props.mapKey, updates));
		},

		setActiveMapKey: () => {
			dispatch(Action.maps.setActiveMapKey(props.mapKey));
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(wrapper);
