import ActionTypes from '../../constants/ActionTypes';
import Action from '../Action';
import _ from 'lodash';

const INITIAL_STATE = {
	byAoiKey: {},
	byPlaceKey: {}
};


function requestForAoi(state, action) {
	let layerRecord = {...getLayerRecord(state, action.aoiKey, action.layerKey), data: action.periods, loading: true};
	let byLayerKey = {...getByLayerKey(state, action.aoiKey), [action.layerKey]: layerRecord};
	let aoiRecord = {...state.byAoiKey[action.aoiKey], byLayerKey: byLayerKey};
	let byAoiKey = {...state.byAoiKey, [action.aoiKey]: aoiRecord};
	return {...state, byAoiKey: byAoiKey};
}

function requestForAoiError(state, action) {
	let layerRecord = {...getLayerRecord(state, action.aoiKey, action.layerKey), loading: false}; //todo should we clear old data?
	let byLayerKey = {...getByLayerKey(state, action.aoiKey), [action.layerKey]: layerRecord};
	let aoiRecord = {...state.byAoiKey[action.aoiKey], byLayerKey: byLayerKey};
	let byAoiKey = {...state.byAoiKey, [action.aoiKey]: aoiRecord};
	return {...state, byAoiKey: byAoiKey};
}

function receiveForAoi(state, action) {
	let layerRecord = {...getLayerRecord(state, action.aoiKey, action.layerKey), data: action.periods, loading: false};
	let byLayerKey = {...getByLayerKey(state, action.aoiKey), [action.layerKey]: layerRecord};
	let aoiRecord = {...state.byAoiKey[action.aoiKey], byLayerKey: byLayerKey};
	let byAoiKey = {...state.byAoiKey, [action.aoiKey]: aoiRecord};
	return {...state, byAoiKey: byAoiKey};
}

function requestForPlace(state, action) {
	let layerRecord = {...getLayerRecord(state, action.placeKey, action.layerKey), data: action.periods, loading: true};
	let byLayerKey = {...getByLayerKey(state, action.placeKey), [action.layerKey]: layerRecord};
	let placeRecord = {...state.byPlaceKey[action.placeKey], byLayerKey: byLayerKey};
	let byPlaceKey = {...state.byPlaceKey, [action.placeKey]: placeRecord};
	return {...state, byPlaceKey: byPlaceKey};
}

function requestForPlaceError(state, action) {
	let layerRecord = {...getLayerRecord(state, action.placeKey, action.layerKey), loading: false};
	let byLayerKey = {...getByLayerKey(state, action.placeKey), [action.layerKey]: layerRecord};
	let placeRecord = {...state.byPlaceKey[action.placeKey], byLayerKey: byLayerKey};
	let byPlaceKey = {...state.byPlaceKey, [action.placeKey]: placeRecord};
	return {...state, byPlaceKey: byPlaceKey};
}

function receiveForPlace(state, action) {
	let layerRecord = {...getLayerRecord(state, action.placeKey, action.layerKey), data: action.periods, loading: false};
	let byLayerKey = {...getByLayerKey(state, action.placeKey), [action.layerKey]: layerRecord};
	let placeRecord = {...state.byPlaceKey[action.placeKey], byLayerKey: byLayerKey};
	let byPlaceKey = {...state.byPlaceKey, [action.placeKey]: placeRecord};
	return {...state, byPlaceKey: byPlaceKey};
}


export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.LAYER_PERIODS_AOI_LAYER_REQUEST:
			return requestForAoi(state, action);
		case ActionTypes.LAYER_PERIODS_AOI_LAYER_RECEIVE:
			return receiveForAoi(state, action);
		case ActionTypes.LAYER_PERIODS_AOI_LAYER_REQUEST_ERROR:
			return requestForAoiError(state, action);
		case ActionTypes.LAYER_PERIODS_PLACE_LAYER_REQUEST:
			return requestForPlace(state, action);
		case ActionTypes.LAYER_PERIODS_PLACE_LAYER_RECEIVE:
			return receiveForPlace(state, action);
		case ActionTypes.LAYER_PERIODS_PLACE_LAYER_REQUEST_ERROR:
			return requestForPlaceError(state, action);
		default:
			return state;
	}
}


function getByLayerKey(state, aoiKey) {
	return state && state.byAoiKey && state.byAoiKey[aoiKey] && state.byAoiKey[aoiKey].byLayerKey;
}
function getLayerRecord(state, aoiKey, layerKey) {
	return getByLayerKey(state, aoiKey) && state.byAoiKey[aoiKey].byLayerKey[layerKey];
}
