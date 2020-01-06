import { connect } from 'react-redux';

import Action from '../../../../../../../state/Action';
import Select from '../../../../../../../state/Select';
import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	return {
		activeSetKey: Select.maps.getActiveSetKey(state)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		addSet: (set) => {
			dispatch(Action.maps.addSet(set));
		},
		addMap: (map) => {
			dispatch(Action.maps.addMap(map));
		},
		addMapToSet: (setKey, mapKey) => {
			dispatch(Action.maps.addMapToSet(setKey, mapKey));
		},
		setSetSync: (setKey, sync) => {
			dispatch(Action.maps.setSetSync(setKey, sync));
		},
		setSetBackgroundLayer: (setKey, backgroundLayer) => {
			dispatch(Action.maps.setSetBackgroundLayer(setKey, backgroundLayer))
		},
		removeSetBackgroundLayer: (setKey) => {
			dispatch(Action.maps.setSetBackgroundLayer(setKey, null))
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);