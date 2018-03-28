import config from '../../config';
import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';

import Select from '../Select';


// ============ creators ===========

function add(maps) {
	return dispatch => {
		if (!_.isArray(maps)) maps = [maps];
		dispatch(actionAdd(maps));
	};
}

function initialize() {
	return dispatch => {
		dispatch(actionInitialize());
	};
}

function remove(mapKeys) {
	return dispatch => {
		if (!_.isArray(mapKeys)) mapKeys = [mapKeys];
		dispatch(actionRemove(mapKeys));
	};
}

function update(maps) {
	return dispatch => {
		if (!_.isArray(maps)) maps = [maps];
		dispatch(actionUpdate(maps));
	};
}

function updateDefaults(defaults) {
	return dispatch => {
		dispatch(actionUpdateDefaults(defaults));
	};
}

function setActive(key) {
	return dispatch => {
		dispatch(actionSetActive(key));
	};
}

function handleMapDependencyOnPeriod(independent) {
	return dispatch => {
		dispatch(actionSetMapIndependentOfPeriod(independent));
	};
}

// specialized

function selectLayerPeriod(layerKey, period, mapKey) {
	return (dispatch, getState) => {
		let appState = getState();
		if (mapKey) {
			let state = _.find(Select.maps.getMaps(appState), {key: mapKey});
			let scope = Select.scopes.getActiveScopeData(appState);
			let layerPeriodPresent = state.layerPeriods && state.layerPeriods[layerKey] && state.layerPeriods[layerKey] === period;

			if (layerPeriodPresent){
				if (scope.oneLayerPerMap){
					dispatch(clearAllLayers(mapKey));
				} else {
					dispatch(clearLayerPeriod(layerKey, mapKey));
				}
			} else {
				let stateUpdate;
				if (scope.oneLayerPerMap){
					stateUpdate = {
						key: mapKey,
						wmsLayers: null,
						layerPeriods: {...state.layerPeriods, [layerKey]: period}
					};
				} else {
					stateUpdate = {
						key: mapKey,
						layerPeriods: {...state.layerPeriods, [layerKey]: period}
					};
				}
				dispatch(update(stateUpdate));
			}
		} else {
			let state = Select.maps.getMapDefaults(appState);
			let stateUpdate = {layerPeriods: {...state.layerPeriods, [layerKey]: period}};
			dispatch(updateDefaults(stateUpdate));
		}
	};
}

function clearLayerPeriod(layerKey, mapKey){
	return (dispatch, getState) => {
		let state = _.find(Select.maps.getMaps(getState()), {key: mapKey});
		let stateUpdate = {
			key: mapKey,
			layerPeriods: {...state.layerPeriods, [layerKey]: null}
		};
		dispatch(update(stateUpdate));
	}
}

function clearLayerPeriodsOfAllMaps(){
	return (dispatch, getState) => {
		let state = Select.maps.getMaps(getState());
		let updates = state.map(map => {return {key: map.key, layerPeriods: null}});
		dispatch(update(updates));
	}
}

function selectWmsLayer(layerKey, mapKey) {
	return (dispatch, getState) => {
		let appState = getState();
		if (mapKey) {
			let state = _.find(Select.maps.getMaps(appState), {key: mapKey});
			let scope = Select.scopes.getActiveScopeData(appState);
			let wmsLayerPresent = _.find(state.wmsLayers, (key) => {return key === layerKey});

			if (wmsLayerPresent){
				if (scope.oneLayerPerMap){
					dispatch(clearAllLayers(mapKey));
				} else {
					dispatch(clearWmsLayer(layerKey, mapKey));
				}
			} else {
				let stateUpdate;
				if (scope.oneLayerPerMap){
					stateUpdate = {
						key: mapKey,
						wmsLayers: [layerKey],
						layerPeriods: null
					};
				} else {
					stateUpdate = {
						key: mapKey,
						wmsLayers: state.wmsLayers ? [...state.wmsLayers, layerKey] : [layerKey]
					};
				}
				dispatch(update(stateUpdate));
			}
		} else {
			let state = Select.maps.getMapDefaults(appState);
			let wmsLayers = state.wmsLayers ? [...state.wmsLayers, layerKey] : [layerKey];
			let stateUpdate = {wmsLayers: wmsLayers};
			dispatch(updateDefaults(stateUpdate));
		}
	};
}

function clearWmsLayer(layerKey, mapKey){
	return (dispatch, getState) => {
		let state = _.find(Select.maps.getMaps(getState()), {key: mapKey});
		let stateUpdate = {
			key: mapKey,
			wmsLayers: _.reject(state.wmsLayers, (key) => {return key === layerKey})
		};
		dispatch(update(stateUpdate));
	}
}

function clearWmsLayersOfAllMaps(){
	return (dispatch, getState) => {
		let state = Select.maps.getMaps(getState());
		let updates = state.map(map => {return {key: map.key, wmsLayers: null}});
		dispatch(update(updates));
	}
}

function clearAllLayers(mapKey){
	return (dispatch, getState) => {
		let stateUpdate = {
			key: mapKey,
			wmsLayers: null,
			layerPeriods: null
		};
		dispatch(update(stateUpdate));
	}
}

// ============ actions ===========

function actionAdd(maps) {
	return {
		type: ActionTypes.MAPS_ADD,
		data: maps
	}
}

function actionRemove(mapKeys) {
	return {
		type: ActionTypes.MAPS_REMOVE,
		keys: mapKeys
	}
}

function actionUpdate(maps) {
	return {
		type: ActionTypes.MAPS_UPDATE,
		data: maps
	}
}

function actionUpdateDefaults(defaults) {
	return {
		type: ActionTypes.MAPS_UPDATE_DEFAULTS,
		defaults: defaults
	}
}

function actionSetActive(key) {
	return {
		type: ActionTypes.MAPS_SET_ACTIVE,
		key: key
	}
}

function actionInitialize() {
	return {
		type: ActionTypes.INITIALIZE
	}
}

function actionSetMapIndependentOfPeriod(independent) {
	return {
		type: ActionTypes.MAPS_SET_INDEPENDENT_OF_PERIOD,
		independent: independent
	}
}

// ============ export ===========

export default {
	add: add,
	initialize: initialize,
	remove: remove,
	update: update,
	updateDefaults: updateDefaults,
	setActive: setActive,
	handleMapDependencyOnPeriod: handleMapDependencyOnPeriod,
	clearLayerPeriodsOfAllMaps: clearLayerPeriodsOfAllMaps,
	clearWmsLayersOfAllMaps: clearWmsLayersOfAllMaps,
	selectLayerPeriod: selectLayerPeriod,
	selectWmsLayer: selectWmsLayer
}
