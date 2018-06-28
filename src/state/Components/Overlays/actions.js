import ActionTypes from '../../../constants/ActionTypes';
import Select from '../../Select';
import _ from 'lodash';

// ============ creators ===========
function closeOverlay(overlayKey){
	return (dispatch, getState) => {
		let overlay = Select.components.overlays.getOverlay(getState(), {key: overlayKey});
		let updatedData = overlay ? {...overlay, open: false} : {open: false};
		dispatch(actionUpdateOverlay(overlayKey, updatedData));
	}
}

function openOverlay(overlayKey){
	return (dispatch, getState) => {
		let overlay = Select.components.overlays.getOverlay(getState(), {key: overlayKey});
		let updatedData = overlay ? {...overlay, open: true} : {open: true};
		dispatch(actionUpdateOverlay(overlayKey, updatedData));
	}
}

function setScenarioMapEditingLayerOpacity(value) {
	return (dispatch, getState) => {
		let overlay = Select.components.overlays.getOverlay(getState(), {key: 'scenarioMapEditing'});
		if (overlay){
			let updatedData = {...overlay, map: overlay.map ? {...overlay.map, layerOpacity: value} : {layerOpacity: value}};
			dispatch(actionUpdateOverlay('scenarioMapEditing', updatedData));
		}
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
	openOverlay: openOverlay,

	setScenarioMapEditingLayerOpacity: setScenarioMapEditingLayerOpacity
}
