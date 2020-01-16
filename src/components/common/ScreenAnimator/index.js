import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state, ownProps) => {
	return {
		activeScreenKey: Select.components.get(state, ownProps.screenAnimatorKey, 'activeScreenKey') || ownProps.activeScreenKey
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onSwitchScreen: (activeScreenKey) => {
			dispatch(Action.components.set(ownProps.screenAnimatorKey, 'activeScreenKey', activeScreenKey));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
