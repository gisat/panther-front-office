import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import _ from 'lodash';


// ============ creators ===========

function showUploadDataOverlay() {
	return (dispatch, getState) => {
		let state = getState();
		let isOpen = Select.components.isDataUploadOverlayOpen(state);
		if (!isOpen){
			let stateUpdate = {
				open: true
			};
			dispatch(updateDataUploadOverlay(stateUpdate));
		}
	};
}

function updateDataUploadOverlay(component) {
	return dispatch => {
		dispatch(actionUpdateDataUploadOverlay(component));
	};
}


// ============ actions ===========
function actionUpdateDataUploadOverlay(component) {
	return {
		type: ActionTypes.COMPONENTS_DATA_UPLOAD_OVERLAY_UPDATE,
		dataUploadOverlay: component
	}
}



// ============ export ===========

export default {
	showUploadDataOverlay: showUploadDataOverlay
}
