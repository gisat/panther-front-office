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
function addLayerTemplates(templates) {
	return (dispatch, getState) => {
		let state = Select.maps.getMapDefaults(getState());
		let layerTemplates;
		if (state && state.layerTemplates){
			layerTemplates = [...state.layerTemplates, ...templates];
		} else {
			layerTemplates = templates;
		}
		dispatch(updateDefaults({layerTemplates: layerTemplates}));
	};
}
function removeLayerTemplates(templates) {
	return (dispatch, getState) => {
		let state = Select.maps.getMapDefaults(getState());
		let scope = Select.scopes.getActive(getState());
		let isPucs = scope && scope.data && scope.data.configuration && scope.data.configuration.pucsLandUseScenarios && scope.data.configuration.pucsLandUseScenarios.styles;

		if (state && state.layerTemplates){
			let finalTemplates = [];
			state.layerTemplates.map(layerTemplate => {
				let stylePath = (layerTemplate.styles && layerTemplate.styles.length) ? layerTemplate.styles[0].path : null;
				let toRemove = _.find(templates, template => {
					// Hack for PUCS
					if ((stylePath || template.styles) && !isPucs){
						let requiredPath = template.styles && template.styles.length ? template.styles[0].path : null;
						return template.templateId === layerTemplate.templateId &&
							requiredPath === stylePath;
					} else {
						return template.templateId === layerTemplate.templateId
					}
				});
				if (!toRemove){
					finalTemplates.push(layerTemplate);
				}
			});
			dispatch(updateDefaults({layerTemplates: finalTemplates}));
		}
	};
}
function setLayerTemplates(templates) {
	return (dispatch, getState) => {
		dispatch(updateDefaults({layerTemplates: templates}));
	};
}

function selectLayerPeriod(layerKey, period, mapKey) {
	return (dispatch, getState) => {
		let appState = getState();
		if (mapKey) {
			let state = _.find(Select.maps.getMaps(appState), {key: mapKey});
			let scope = Select.scopes.getActiveScopeData(appState);

			let stateUpdate;
			if (scope && scope.data && (scope.data.oneLayerPerMap || scope.data.configuration && scope.data.configuration.oneLayerPerMap)){
				stateUpdate = {
					key: mapKey,
					wmsLayers: null,
					layerPeriods: {[layerKey]: period}
				};
			} else {
				stateUpdate = {
					key: mapKey,
					layerPeriods: {...state.layerPeriods, [layerKey]: period}
				};
			}
			dispatch(update(stateUpdate));

		} else {
			let state = Select.maps.getMapDefaults(appState);
			let stateUpdate = {layerPeriods: {...state.layerPeriods, [layerKey]: period}};
			dispatch(updateDefaults(stateUpdate));
		}
	};
}

function changeDefaultMapName(name){
	return (dispatch, getState) => {
		dispatch(update({
			key: "default-map",
			name: name
		}));
	}
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

function clearPlaceGeometryChangeReviewOfAllMaps(){
	return (dispatch, getState) => {
		let state = Select.maps.getMaps(getState());
		let updates = state.map(map => {return {key: map.key, placeGeometryChangeReview: null}});
		dispatch(update(updates));
	}
}

function clearPlaceLPISCheckGeometryOfAllMaps() {
	return (dispatch, getState) => {
		let state = Select.maps.getMaps(getState());
		let updates = state.map(map => {return {key: map.key, placeGeometryLPISCheck: null}});
		dispatch(update(updates));
	}
}

function selectWmsLayer(layerKey, mapKey) {
	return (dispatch, getState) => {
		let appState = getState();
		if (mapKey) {
			let state = _.find(Select.maps.getMaps(appState), {key: mapKey});
			let scope = Select.scopes.getActiveScopeData(appState);

			let stateUpdate;
			if (scope && scope.data && (scope.data.oneLayerPerMap || scope.data.configuration && scope.data.configuration.oneLayerPerMap)){
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

		} else {
			let state = Select.maps.getMapDefaults(appState);
			let layerKeys = layerKey;
			if (!_.isArray(layerKeys)) layerKeys = [layerKeys];
			let wmsLayers;
			if (state && state.wmsLayers){
				wmsLayers = _.union(state.wmsLayers, layerKeys);
			} else {
				wmsLayers = layerKeys;
			}
			let stateUpdate = {wmsLayers: wmsLayers};
			dispatch(updateDefaults(stateUpdate));
		}
	};
}

function clearWmsLayer(layerKey, mapKey){
	return (dispatch, getState) => {
		let appState = getState();
		if (mapKey){
			let state = _.find(Select.maps.getMaps(appState), {key: mapKey});
			let stateUpdate = {
				key: mapKey,
				wmsLayers: _.without(state.wmsLayers, layerKey)
			};
			dispatch(update(stateUpdate));
		} else {
			let state = Select.maps.getMapDefaults(appState);
			let stateUpdate = {
				wmsLayers: _.without(state.wmsLayers, layerKey)
			};
			dispatch(updateDefaults(stateUpdate));
		}
	}
}

function clearWmsLayersOfAllMaps(){
	return (dispatch, getState) => {
		let state = Select.maps.getMaps(getState());
		let updates = state.map(map => {return {key: map.key, wmsLayers: null}});
		dispatch(update(updates));
	}
}

function setActiveBackgroundLayer(key){
	return (dispatch, getState) => {
		let state = Select.maps.getMapDefaults(getState());
		if (state && state.activeBackgroundLayerKey !== key){
			dispatch(updateDefaults({
				activeBackgroundLayerKey: key
			}));
		}
	}
}

function setAnalyticalUnitsVisibility(display){
	return (dispatch, getState) => {
		let state = Select.maps.getMapDefaults(getState());
		if (state){
			dispatch(updateDefaults({
				analyticalUnitsVisible: display
			}));
		}
	}
}

function updateNavigator(navigator){
	return (dispatch, getState) => {
		dispatch(updateDefaults(navigator));
	}
}

function updateWithScenarios(){
	return (dispatch, getState) => {
		let state = getState();
		let maps = Select.maps.getMapsOverrides(state);
		let activeScenarios = Select.scenarios.scenarios.getActiveScenarios(state);
		let updatedMaps = [];
		maps.map(map => {
			let scenarioForMap = _.find(activeScenarios, (scenario) => {return scenario.key === map.scenarioKey});
			if (scenarioForMap){
				updatedMaps.push({...map, name: scenarioForMap.data.name, dataLoading: false});
			} else {
				updatedMaps.push(map);
			}
		});
		dispatch(update(updatedMaps));
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
	addLayerTemplates: addLayerTemplates,
	changeDefaultMapName: changeDefaultMapName,
	clearLayerPeriod: clearLayerPeriod,
	clearLayerPeriodsOfAllMaps: clearLayerPeriodsOfAllMaps,
	clearWmsLayer: clearWmsLayer,
	clearWmsLayersOfAllMaps: clearWmsLayersOfAllMaps,
	clearPlaceGeometryChangeReviewOfAllMaps: clearPlaceGeometryChangeReviewOfAllMaps,
	clearPlaceLPISCheckGeometryOfAllMaps: clearPlaceLPISCheckGeometryOfAllMaps,
	handleMapDependencyOnPeriod: handleMapDependencyOnPeriod,
	initialize: initialize,
	remove: remove,
	removeLayerTemplates: removeLayerTemplates,
	selectLayerPeriod: selectLayerPeriod,
	selectWmsLayer: selectWmsLayer,
	setActive: setActive,
	setActiveBackgroundLayer: setActiveBackgroundLayer,
	setAnalyticalUnitsVisibility: setAnalyticalUnitsVisibility,
	setLayerTemplates,
	update: update,
	updateDefaults: updateDefaults,
	updateNavigator: updateNavigator,
	updateWithScenarios: updateWithScenarios
}
