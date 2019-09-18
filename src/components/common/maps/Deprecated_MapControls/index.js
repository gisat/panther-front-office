import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state, props) => {
	const activeMapKey = Select.maps.getActiveMapKey(state);
	return {
		navigator: Select.maps.getNavigator_deprecated(state, activeMapKey),
		activeMapKey: activeMapKey,
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		setNavigator: (mapKey, navigator) => {
			dispatch(Action.maps.deprecated_updateWorldWindNavigator(mapKey, navigator))
		},
		resetHeading: (mapKey) => {
			//todo disable button while reseting
			dispatch(Action.maps.deprecated_resetWorldWindNavigatorHeading(mapKey))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
