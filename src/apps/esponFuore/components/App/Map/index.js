import { connect } from 'react-redux';
import Select from '../../../../../state/Select';
import Action from "../../../../../state/Action";

import wrapper from '../../../../../components/common/maps/MapWrapper';

import utils from '../../../../../utils/utils';

const mapStateToProps = (state, props) => {
	let backgroundLayerState = Select.maps.getBackgroundLayerStateByMapKey(state, props.mapKey);
	let backgroundLayerData = backgroundLayerState ? [{filter: backgroundLayerState.mergedFilter, data: backgroundLayerState.layer}] : null;

	let layersState = Select.maps.getLayersStateByMapKey(state, props.mapKey);
	let layersData = layersState ? layersState.map(layer => {return {filter: layer.mergedFilter, data: layer.layer}}) : null;
	let layers = Select.maps.getLayers(state, layersData);
	let vectorLayers = layers ? layers.filter((layerData) => layerData.type === 'vector') : [];

	//TODO -> select
	let layersVectorData = vectorLayers.reduce((acc, layerData) => {
		if(layerData.spatialRelationsData) {
			const filter = {
				spatialDataSourceKey: layerData.spatialDataSourceKey,
				fidColumnName: layerData.spatialRelationsData.fidColumnName
			};
			acc[layerData.key] = Select.spatialDataSources.vector.getBatchByFilterOrder(state, filter, null);	
			// acc[layerData.key] = Select.attributeDataSources.vector.getBatchByFilterOrder(state, filter, null);	
			return acc
		}
	}, {});

	return {
		backgroundLayer: Select.maps.getLayers(state, backgroundLayerData),
		layers,
		layersVectorData,
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
		},

		onWorldWindNavigatorChange: (updates) => {
			dispatch(Action.maps.updateWorldWindNavigator(props.mapKey, updates));
		},

		setActiveMapKey: () => {
			dispatch(Action.maps.setActiveMapKey(props.mapKey));
		},

		loadLayerData: (layer) => {
			const spatialFilter = {
				spatialDataSourceKey: layer.spatialDataSourceKey,
				fidColumnName: layer.spatialRelationsData.fidColumnName
				//by active period
			};

			const attributeFilter = {
				attributeDataSourceKey: props.activeAttributeKey,
				fidColumnName: layer.spatialRelationsData.fidColumnName,
				//by active period
			};

			dispatch(Action.spatialDataSources.vector.loadLayerData(spatialFilter, componentId));
			dispatch(Action.attributesDataSources.loadFilteredData(attributeFilter, componentId));
			//load statistics
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(wrapper);