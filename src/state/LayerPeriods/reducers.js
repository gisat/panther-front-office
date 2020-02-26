import ActionTypes from '../../constants/ActionTypes';

const INITIAL_STATE = {
	byAoiKey: {},
	byPlaceKey: {},
	byKey: {}
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
	let layerRecord = {...getLayerRecordForPlace(state, action.placeKey, action.layerKey), data: action.periods, loading: true};
	let byLayerKey = {...getByLayerKeyForPlace(state, action.placeKey), [action.layerKey]: layerRecord};
	let placeRecord = {...state.byPlaceKey[action.placeKey], byLayerKey: byLayerKey};
	let byPlaceKey = {...state.byPlaceKey, [action.placeKey]: placeRecord};
	return {...state, byPlaceKey: byPlaceKey};
}

function requestForPlaceError(state, action) {
	let layerRecord = {...getLayerRecordForPlace(state, action.placeKey, action.layerKey), loading: false};
	let byLayerKey = {...getByLayerKeyForPlace(state, action.placeKey), [action.layerKey]: layerRecord};
	let placeRecord = {...state.byPlaceKey[action.placeKey], byLayerKey: byLayerKey};
	let byPlaceKey = {...state.byPlaceKey, [action.placeKey]: placeRecord};
	return {...state, byPlaceKey: byPlaceKey};
}

function receiveForPlace(state, action) {
	let layerRecord = {...getLayerRecordForPlace(state, action.placeKey, action.layerKey), data: action.periods, loading: false};
	let byLayerKey = {...getByLayerKeyForPlace(state, action.placeKey), [action.layerKey]: layerRecord};
	let placeRecord = {...state.byPlaceKey[action.placeKey], byLayerKey: byLayerKey};
	let byPlaceKey = {...state.byPlaceKey, [action.placeKey]: placeRecord};
	return {...state, byPlaceKey: byPlaceKey};
}

function requestForKey(state, action) {
	let layerRecord = {...getLayerRecordForKey(state, action.key, action.layerKey), data: action.periods, loading: true};
	let byLayerKey = {...getByLayerKeyForKey(state, action.key), [action.layerKey]: layerRecord};
	let record = {...state.byKey[action.key], byLayerKey: byLayerKey};
	let byKey = {...state.byKey, [action.key]: record};
	return {...state, byKey: byKey};
}

function requestForKeyError(state, action) {
	let layerRecord = {...getLayerRecordForKey(state, action.key, action.layerKey), loading: false};
	let byLayerKey = {...getByLayerKeyForKey(state, action.key), [action.layerKey]: layerRecord};
	let record = {...state.byKey[action.key], byLayerKey: byLayerKey};
	let byKey = {...state.byKey, [action.key]: record};
	return {...state, byKey: byKey};
}

function receiveForKey(state, action) {
	let layerRecord = {...getLayerRecordForKey(state, action.key, action.layerKey), data: action.periods, loading: false};
	let byLayerKey = {...getByLayerKeyForKey(state, action.key), [action.layerKey]: layerRecord};
	let record = {...state.byKey[action.key], byLayerKey: byLayerKey};
	let byKey = {...state.byKey, [action.key]: record};
	return {...state, byKey: byKey};
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
		case ActionTypes.LAYER_PERIODS_KEY_LAYER_REQUEST:
			return requestForKey(state, action);
		case ActionTypes.LAYER_PERIODS_KEY_LAYER_RECEIVE:
			return receiveForKey(state, action);
		case ActionTypes.LAYER_PERIODS_KEY_LAYER_REQUEST_ERROR:
			return requestForKeyError(state, action);
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

function getByLayerKeyForPlace(state, placeKey) {
	return state && state.byPlaceKey && state.byPlaceKey[placeKey] && state.byPlaceKey[placeKey].byLayerKey;
}
function getLayerRecordForPlace(state, placeKey, layerKey) {
	return getByLayerKeyForPlace(state, placeKey) && state.byPlaceKey[placeKey].byLayerKey[layerKey];
}

function getByLayerKeyForKey(state, key) {
	return state && state.byKey && state.byKey[key] && state.byKey[key].byLayerKey;
}
function getLayerRecordForKey(state, key, layerKey) {
	return getByLayerKeyForKey(state, key) && state.byKey[key].byLayerKey[layerKey];
}
