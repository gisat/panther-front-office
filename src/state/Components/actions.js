import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import _ from 'lodash';


// ============ creators ===========

function handleUploadDataOverlay(open) {
	return (dispatch, getState) => {
		let state = getState();
		let isOpen = Select.components.isDataUploadOverlayOpen(state);
		if (isOpen !== open){
			let stateUpdate = {
				open: open
			};
			dispatch(update("dataUploadOverlay", stateUpdate));
		}
	};
}

function handleWindowVisibility(window, open){
	return (dispatch, getState) => {
		let state = getState();
		let windows = Select.components.getWindows(state);
		if (window && windows[window]){
			let openState = false;
			if (open){
				openState = true;
			}
			let stateUpdate = {...windows, [window]: {...windows[window], open: openState}};
			dispatch(update("windows", stateUpdate));
		}
	};
}

function update(component, data) {
	return dispatch => {
		dispatch(actionUpdate(component, data));
	};
}


// ============ actions ===========
function actionUpdate(component, data) {
	return {
		type: ActionTypes.COMPONENTS_UPDATE,
		component: component,
		update: data
	}
}



// ============ export ===========

export default {
	handleWindowVisibility: handleWindowVisibility,
	handleUploadDataOverlay: handleUploadDataOverlay
}
