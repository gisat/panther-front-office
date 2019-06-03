import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import ScenariosWindow from "../../../presentation/windows/ScenariosWindow/ScenariosWindow";

const mapStateToProps = (state, ownProps) => {
	return {
		activeScreenKey: Select.components.windows.scenarios.getActiveScreenKey(state)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		changeActiveScreen: (screenKey) => {
			dispatch(Action.components.windows.scenarios.setActiveScreen(screenKey));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ScenariosWindow);