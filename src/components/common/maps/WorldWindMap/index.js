import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import wrapper from '../MapWrapper';

const mapStateToProps = (state, props) => {
	let backgroundLayerState = Select.maps.getBackgroundLayerStateByMapKey(state, props.mapKey);

	return {
		// TODO use same selector for background layers and layers layers
		backgroundLayer: Select.maps.getBackgroundLayer(state, backgroundLayerState ? backgroundLayerState.layerTemplate : null),
		layers: null,
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
