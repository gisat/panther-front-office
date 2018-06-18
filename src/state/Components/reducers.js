import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	overlays: {
		dataUpload: {
			open: false
		},
		scenarioMapEditing: {
			open: true
		}
	},
	windows: {
		// TODO windows z-order
		scenarios: {
			open: false,
			activeScreenKey: "caseList"
		},
		areas: null
	}
};

function update(state, action) {
	return {...state, [action.component]: state[action.component] ? {...state[action.component], ...action.update} : action.update};
}

function updateOverlay(state, action) {
	return {...state, overlays: {...state.overlays, [action.overlayKey]:  state.overlays[action.overlayKey] ? {...state.overlays[action.overlayKey], ...action.update} : action.update}};
}

function updateWindow(state, action) {
	return {...state, windows: {...state.windows, [action.windowKey]:  state.windows[action.windowKey] ? {...state.windows[action.windowKey], ...action.update} : action.update}};
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.COMPONENTS_UPDATE:
			return update(state, action);
		case ActionTypes.COMPONENTS_OVERLAY_UPDATE:
			return updateOverlay(state, action);
		case ActionTypes.COMPONENTS_WINDOW_UPDATE:
			return updateWindow(state, action);
		default:
			return state;
	}
}
