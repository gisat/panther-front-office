import ActionTypes from '../../../../constants/ActionTypes';
import Action from '../../../Action';
import Select from '../../../Select';
import _ from 'lodash';

// ============ creators ===========
function setActiveScreen(screenKey){
	return (dispatch) => {
		dispatch(updateProperty('activeScreenKey', screenKey));
	};
}

function activateCaseEditing() {
	return (dispatch) => {
		dispatch(updateProperty('editingActive', true));
	};
}

function deactivateCaseEditing() {
	return (dispatch) => {
		dispatch(updateProperty('editingActive', false));
	};
}

function updateProperty(key, value){
	return (dispatch, getState) => {
		let state = getState();
		let window = Select.components.windows.getWindow(state, {key: 'scenarios'});
		if (window){
			let stateUpdate = {
				...window,
				[key]: value
			};
			dispatch(Action.components.windows.updateWindow('scenarios', stateUpdate));
		}
	};
}

// ============ export ===========

export default {
	activateCaseEditing: activateCaseEditing,
	deactivateCaseEditing: deactivateCaseEditing,
	setActiveScreen: setActiveScreen
}
