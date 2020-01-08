import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import wrapper from '../Deprecated_MapWrapper';

import utils from '../../../../utils/utils';

const mapStateToProps = (state, props) => {
	let backgroundLayerState = Select.maps.getBackgroundLayerStateByMapKey_deprecated(state, props.mapKey);
	let backgroundLayerData = backgroundLayerState ? [{filter: backgroundLayerState.mergedFilter, data: backgroundLayerState.layer}] : null;

	let layersState = Select.maps.getLayersStateByMapKey_deprecated(state, props.mapKey);
	let layersData = layersState ? layersState.map(layer => {return {filter: layer.mergedFilter, data: layer.layer}}) : null;
	let layers = Select.maps.getLayers_deprecated(state, layersData);

	let layersVectorData = layers ? layers.reduce((acc, layerData) => {
		if(layerData.type === 'vector' && layerData.spatialRelationsData) {
			const filter = {
				spatialDataSourceKey: layerData.spatialDataSourceKey,
				fidColumnName: layerData.spatialRelationsData.fidColumnName
			};
			acc[layerData.key] = Select.spatialDataSources.vector.getBatchByFilterOrder(state, filter, null);	
			return acc
		}
	}, {}) : null;

	return {
		backgroundLayer: Select.maps.getLayers_deprecated(state, backgroundLayerData),
		layers,
		layersVectorData,
		navigator: Select.maps.getNavigator_deprecated(state, props.mapKey)
	}
};

const mapDispatchToProps = (dispatch, props) => {
	const componentId = 'WorldWindMapSelector_' + utils.randomString(6);

	return {
		onMount: () => {
			dispatch(Action.maps.deprecated_use(props.mapKey));
			const layerTreesFilter = props.layerTreesFilter;
			//action to load LT data and add visible layers to map store
			dispatch(Action.layersTrees.ensureData(layerTreesFilter, componentId)).then(() => {
				//parse map LT data
				dispatch(Action.maps.addLayersToMaps(layerTreesFilter, [props.mapKey]));
			});
		},

		onUnmount: () => {
			dispatch(Action.maps.deprecated_useClear(props.mapKey));
			dispatch(Action.layersTrees.useIndexedClear(componentId));
			dispatch(Action.spatialDataSources.vector.useIndexedClear(componentId));
		},

		onWorldWindNavigatorChange: (updates) => {
			dispatch(Action.maps.deprecated_updateWorldWindNavigator(props.mapKey, updates));
		},

		setActiveMapKey: () => {
			dispatch(Action.maps.setActiveMapKey(props.mapKey));
		},

		loadLayerData: (layer) => {
			const filter = {
				spatialDataSourceKey: layer.spatialDataSourceKey,
				fidColumnName: layer.spatialRelationsData.fidColumnName
			};

			dispatch(Action.spatialDataSources.vector.loadLayerData(filter, componentId));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(wrapper);
