import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import wrapper from '../MapWrapper';

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
	return {
		onMount: () => {
			dispatch(Action.maps.use(props.mapKey));
		},

		onUnmount: () => {
			dispatch(Action.maps.useClear(props.mapKey));
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
