import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import wrapper from '../MapWrapper';
import {layersInitial} from './mockData';

const mapStateToProps = (state, props) => {
	let backgroundLayerKey = Select.maps.getBackgroundLayerStateByMapKey(state, props.mapKey);

	return {
		backgroundLayer: Select.maps.getBackgroundLayer(state, backgroundLayerKey),
		layers: layersInitial,
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
