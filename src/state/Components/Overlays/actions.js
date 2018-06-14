import ActionTypes from '../../../constants/ActionTypes';
import Select from '../../Select';
import _ from 'lodash';

// ============ creators ===========
function closeOverlay(overlayKey){
	return (dispatch, getState) => {
		let overlay = Select.components.overlays.getOverlay(getState(), overlayKey);
		let updatedData = overlay ? {...overlay, open: false} : {open: false};
		dispatch(actionUpdateOverlay(overlayKey, updatedData));
	}
}

function openOverlay(overlayKey){
	return (dispatch, getState) => {
		let overlay = Select.components.overlays.getOverlay(getState(), overlayKey);
		let updatedData = overlay ? {...overlay, open: true} : {open: true};
		dispatch(actionUpdateOverlay(overlayKey, updatedData));
	}
}

// ============ actions ===========
function actionUpdateOverlay(overlayKey, data) {
	return {
		type: ActionTypes.COMPONENTS_OVERLAY_UPDATE,
		overlayKey: overlayKey,
		update: data
	}
}

// ============ export ===========

export default {
	closeOverlay: closeOverlay,
	openOverlay: openOverlay
}
