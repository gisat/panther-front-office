import {connect} from '@gisatcz/ptr-state';
import {Select, Action} from '@gisatcz/ptr-state';

import presentation from './presentation';

const mapStateToProps = (state, props) => {
	const activeMapKey = Select.maps.getActiveMapKey(state);
	return {
		navigator: activeMapKey ? Select.maps.getNavigator_deprecated(state, activeMapKey) : null,
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
