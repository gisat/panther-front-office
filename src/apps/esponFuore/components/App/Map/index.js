import { connect } from 'react-redux';
import Select from '../../../../../state/Select';
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

	//TODO -> select
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

			acc[layerData.key] = Select.attributeDataSources.getBatchByFilterOrder(state, attributeDataSourceFilter, null);
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
		backgroundLayer: [{type:'wikimedia'}],
		layers,
		layersVectorData,
		layersAttributeData,
		layersAttributeStatistics,
		navigator: Select.maps.getNavigator(state, props.mapKey),
		activeAttributeKey: Select.attributes.getActiveKey(state)
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
			dispatch(Action.attributesDataSources.useIndexedClear(componentId));
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
