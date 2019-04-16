import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import wrapper from '../MapWrapper';

import utils from '../../../../utils/utils';

const mapStateToProps = (state, props) => {
	let backgroundLayerState = Select.maps.getBackgroundLayerStateByMapKey(state, props.mapKey);
	let backgroundLayerData = backgroundLayerState ? [{filter: backgroundLayerState.mergedFilter, data: backgroundLayerState.layer}] : null;

	let layersState = Select.maps.getLayersStateByMapKey(state, props.mapKey);
	let layersData = layersState ? layersState.map(layer => {return {filter: layer.mergedFilter, data: layer.layer}}) : null;
	return {
		backgroundLayer: Select.maps.getLayers(state, backgroundLayerData),
		layers: Select.maps.getLayers(state, layersData),
		navigator: Select.maps.getNavigator(state, props.mapKey)
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
		},

		onWorldWindNavigatorChange: (updates) => {
			dispatch(Action.maps.updateWorldWindNavigator(props.mapKey, updates));
		},

		setActiveMapKey: () => {
			dispatch(Action.maps.setActiveMapKey(props.mapKey));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(wrapper);
