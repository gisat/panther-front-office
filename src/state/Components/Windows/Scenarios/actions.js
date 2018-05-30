import ActionTypes from '../../../../constants/ActionTypes';
import Action from '../../../Action';
import Select from '../../../Select';
import _ from 'lodash';

// ============ creators ===========
function setActiveScreen(screenKey){
	return (dispatch, getState) => {
		let state = getState();
		let window = Select.components.windows.getWindow(state, {key: 'scenarios'});
		if (window){
			let stateUpdate = {
					...window,
					activeScreenKey: screenKey
				};
			dispatch(Action.components.windows.updateWindow('scenarios', stateUpdate));
		}
	};
}

// ============ export ===========

export default {
	// activateScenariosEditing: activateScenariosEditing,
	// deactivateScenariosEditing: deactivateScenariosEditing,
	setActiveScreen: setActiveScreen
}
