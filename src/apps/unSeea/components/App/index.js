import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../state/Action';
import Select from '../../state/Select';

import presentation from "./presentation";

const mapStateToProps = state => {
	const activeMapKey = Select.maps.getActiveMapKey(state);
	const activeWorldWindNavigator = Select.maps.getNavigator_deprecated(state, activeMapKey)
	return {
		worldWindNavigator: activeWorldWindNavigator,
	}
};


const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onActiveMapSetChanged: (mapKey, mapSetKey, worldWindNavigator) => {
			dispatch(Action.maps.setActiveSetKey(mapSetKey));
			dispatch(Action.maps.setActiveMapKey(mapKey));
			dispatch(Action.maps.deprecated_setSetWorldWindNavigator(mapSetKey, worldWindNavigator));
		}
	}
};


export default connect(mapStateToProps, mapDispatchToProps)(presentation);