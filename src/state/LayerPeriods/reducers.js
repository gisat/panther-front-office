import ActionTypes from '../../constants/ActionTypes';
import Action from '../Action';
import _ from 'lodash';

const INITIAL_STATE = {
	byAoiKey: {}
};


function requestForAoi(state, action) {
	let layerRecord = {...state.byAoiKey[action.aoiKey].byLayerKey[action.layerKey], data: action.periods, loading: true};
	let byLayerKey = {...state.byAoiKey[action.aoiKey].byLayerKey, [action.layerKey]: layerRecord};
	let aoiRecord = {...state.byAoiKey[action.aoiKey], byLayerKey: byLayerKey};
	let byAoiKey = {...state.byAoiKey, [action.aoiKey]: aoiRecord};
	return {...state, byAoiKey: byAoiKey};
}

function requestForAoiError(state, action) {
	let layerRecord = {...state.byAoiKey[action.aoiKey].byLayerKey[action.layerKey], loading: false}; //todo should we clear old data?
	let byLayerKey = {...state.byAoiKey[action.aoiKey].byLayerKey, [action.layerKey]: layerRecord};
	let aoiRecord = {...state.byAoiKey[action.aoiKey], byLayerKey: byLayerKey};
	let byAoiKey = {...state.byAoiKey, [action.aoiKey]: aoiRecord};
	return {...state, byAoiKey: byAoiKey};
}

function receiveForAoi(state, action) {
	let layerRecord = {...state.byAoiKey[action.aoiKey].byLayerKey[action.layerKey], data: action.periods, loading: false};
	let byLayerKey = {...state.byAoiKey[action.aoiKey].byLayerKey, [action.layerKey]: layerRecord};
	let aoiRecord = {...state.byAoiKey[action.aoiKey], byLayerKey: byLayerKey};
	let byAoiKey = {...state.byAoiKey, [action.aoiKey]: aoiRecord};
	return {...state, byAoiKey: byAoiKey};
}


export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.LAYER_PERIODS_AOI_REQUEST:
			return requestForAoi(state, action);
		case ActionTypes.LAYER_PERIODS_AOI_RECEIVE:
			return receiveForAoi(state, action);
		case ActionTypes.LAYER_PERIODS_AOI_REQUEST_ERROR:
			return requestForAoiError(state, action);
		default:
			return state;
	}
}
