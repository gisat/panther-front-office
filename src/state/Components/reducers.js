import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import Names from '../../constants/Names';

const INITIAL_STATE = {
	application: {
		intro: true,
		style: {
			activeKey: null,
			configuration: {
				forScope: {
					htmlClass: null
				},
				forUrl: {
					htmlClass: null
				}
			}
		}
	},
	mapsContainer: {
		columns: 1,
		rows: 1
	},
	overlays: {
		dataUpload: {
			open: false
		},
		scenarioMapEditing: {
			open: false,
			map: {
				layerLoading: false,
				layerLoadingProgress: 0,
				layerOpacity: 70,
				layerSource: null,
				dataSourceKey: null,
			}
		},
		views: {
			intro: {
				name: null,
				title: null,
				text: null,
				logo: null,
				sections: null
			},
			open: true,
			selectedScope: null,
			changeReviews: {
				activeScreenKey: "changeReviewsList"
			}
		},
		login: {
			open: false
		}
	},
	share: {
		toSave: null,
	},
	windows: {
		// TODO windows z-order
		scenarios: {
			open: false,
			activeScreenKey: "caseList"
		},
		snapshots: {
			open: false,
		},
		views: {
			open: false
		},
		share: {
			open: false
		}
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

// todo move following reducers to separate file
function updateScenarioMapEditingMapData(state, action){
	return {...state, overlays: {...state.overlays, scenarioMapEditing: {...state.overlays.scenarioMapEditing, map: {...state.overlays.scenarioMapEditing.map, ...action.data}}}}
}

function setShareSaveState(state, action) {
	return {...state, share: {...state.share, toSave: action.toSave}};
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.COMPONENTS_UPDATE:
			return update(state, action);
		case ActionTypes.COMPONENTS_OVERLAY_UPDATE:
			return updateOverlay(state, action);
		case ActionTypes.COMPONENTS_WINDOW_UPDATE:
			return updateWindow(state, action);
		case ActionTypes.COMPONENTS_OVERLAY_MAP_EDITING_COPY_PROGRESS:
			return updateScenarioMapEditingMapData(state, action);
		case ActionTypes.COMPONENTS_OVERLAY_MAP_EDITING_COPY_RECEIVE:
			return updateScenarioMapEditingMapData(state, action);
		case ActionTypes.COMPONENTS_OVERLAY_MAP_EDITING_COPY_REQUEST:
			return updateScenarioMapEditingMapData(state, action);
		case ActionTypes.COMPONENTS_OVERLAY_MAP_EDITING_COPY_REQUEST_ERROR:
			return updateScenarioMapEditingMapData(state, action);
		case ActionTypes.COMPONENTS_SHARE_SAVE_STATE:
			return setShareSaveState(state, action);
		default:
			return state;
	}
}
