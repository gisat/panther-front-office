import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../../../state/Action";

import {cloneDeep} from 'lodash';

import wrapper from '../../../../../components/common/maps/MapWrapper';

import utils from '../../../../../utils/utils';

const mapStateToProps = (state, props) => {
	let backgroundLayerState = Select.maps.getBackgroundLayerStateByMapKey(state, props.mapKey);
	let backgroundLayerData = backgroundLayerState ? [{filter: backgroundLayerState.mergedFilter, data: backgroundLayerState.layer}] : null;

	let layersState = Select.maps.getLayersStateByMapKey(state, props.mapKey);
	let layersData = layersState ? layersState.map(layer => {
		const filter = cloneDeep(layer.mergedFilter)
		return {filter, data: layer.layer}
	}) : null;
	let layers = Select.maps.getLayers(state, layersData);
	let vectorLayers = layers ? layers.filter((layerData) => layerData.type === 'vector') : [];
	let activeFilter = Select.selections.getActive(state);

	//TODO -> select
	//active indicator type absolute/relative
	let activeIndicatorKey = Select.components.get(state, 'esponFuore_IndicatorSelect', 'activeIndicator');
	let activeIndicator = Select.specific.esponFuoreIndicators.getByKey(state, activeIndicatorKey);
	const indicatorData = activeIndicator ? activeIndicator.data.type : 'relative';
	// const hueColor = '#00ff2b'; //green
	const hueColor = '#4689d0'; //blue
	// const hueColor = '#ff0000'; //red
	
	const map = Select.maps.getMapByKey(state, props.mapKey);
	let label = null;
	if(map && map.data && map.data.metadataModifiers && map.data.metadataModifiers.period) {
		const periodKey = map.data.metadataModifiers.period;
		const period = Select.periods.getDataByKey(state, periodKey);
		label = period ? period.nameDisplay : null
	}

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
				attributeDataSourceKey: layerData.attributeRelationsData.attributeDataSourceKey,
				fidColumnName: layerData.attributeRelationsData.fidColumnName
			};

			acc[layerData.key] = Select.attributeData.getBatchByFilterOrder(state, attributeDataSourceFilter, null);
		}
		return acc
	}, {});
	
	let layersMetadata = vectorLayers.reduce((acc, layerData) => {
		if(layerData.attributeRelationsData) {
			const attributeDataSource = Select.attributeDataSources.getByKeys(state, [layerData.attributeRelationsData.attributeDataSourceKey]);
			const attributeDataKey = attributeDataSource && attributeDataSource[0] ? attributeDataSource[0].data.columnName : null;
			const attributeKey = layerData.attributeRelationsData.attributeKey
			const attribute = Select.attributes.getByKey(state, attributeKey);
			acc[layerData.key] = {
				dataType: indicatorData,
				attributeDataKey,
				color: attribute &&  attribute.data && attribute.data.color ? attribute.data.color : hueColor,
			}
		}
		return acc
	}, {});
	
	let layersAttributeStatistics = vectorLayers.reduce((acc, layerData) => {
		if(layerData.attributeRelationsData) {
			const attributeStatisticsFilter = {
				attributeDataSourceKey: layerData.attributeRelationsData.attributeDataSourceKey
			};

			acc[layerData.key] = Select.attributeStatistics.getBatchByFilterOrder(state, attributeStatisticsFilter, null);
		}
		return acc
	}, {});

	return {
		// backgroundLayer: Select.maps.getLayers(state, backgroundLayerData),
		activeFilter,
		backgroundLayer: [{type:'wikimedia'}],
		layers,
		layersVectorData,
		layersAttributeData,
		layersAttributeStatistics,
		layersMetadata,
		navigator: Select.maps.getNavigator(state, props.mapKey),
		activeAttributeKey: Select.attributes.getActiveKey(state),
		label: label || null,
	}
};

const mapDispatchToProps = (dispatch, props) => {
	const componentId = 'WorldWindMapSelector_' + utils.randomString(6);

	return {
		onMount: () => {
			dispatch(Action.maps.use(props.mapKey));
			const layerTreesFilter = props.layerTreesFilter;
			//action to load LT data and add visible layers to map store
			dispatch(Action.layersTrees.ensureData(layerTreesFilter, componentId)).then(() => {
				//parse map LT data
				dispatch(Action.maps.loadLayerTreesData(layerTreesFilter, [props.mapKey]));
			});
		},

		onUnmount: () => {
			dispatch(Action.maps.useClear(props.mapKey));
			dispatch(Action.layersTrees.useIndexedClear(componentId));
			dispatch(Action.attributeData.useIndexedClear(componentId));
			dispatch(Action.spatialDataSources.vector.useIndexedClear(componentId));

			//FIXME - clear spatial, attributes data, relations...
		},

		onWorldWindNavigatorChange: (updates) => {
			dispatch(Action.maps.updateWorldWindNavigator(props.mapKey, updates));
		},

		setActiveMapKey: () => {
			dispatch(Action.maps.setActiveMapKey(props.mapKey));
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(wrapper);
