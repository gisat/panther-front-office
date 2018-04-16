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
	handleUploadDataOverlay: handleUploadDataOverlay
}
