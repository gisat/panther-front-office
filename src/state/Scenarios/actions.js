import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import config from '../../config';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';

const TTL = 5;

// ============ creators ===========

function add(scenarios) {
	return dispatch => {
		if (!_.isArray(scenarios)) scenarios = [scenarios];
		dispatch(actionAdd(scenarios));
	};
}

function setActive(key) {
	return (dispatch) => {
		if (!_.isArray(key)) key = [key];
		dispatch(actionSetActive(key));
	};
}

function updateEditedActiveCase(key, value) {
	return (dispatch, getState) => {
		let activeCase = Select.scenarios.getActiveCase(getState());
		let sameCoordinates = false;

		if (activeCase){
			if (key === 'geometry' && activeCase.geometry){
				let geometry = _.cloneDeep(activeCase.geometry);
				sameCoordinates = JSON.stringify(value.coordinates) === JSON.stringify(geometry.coordinates);
			}
			if (sameCoordinates || (value === activeCase[key]) || (!activeCase[key] && value.length === 0)){
				dispatch(actionRemovePropertyFromEditedCase(activeCase.key, key));
			} else {
				dispatch(actionUpdateEditedCases([{key: activeCase.key, data: {[key]: value}}]));
			}
		} else {
			dispatch(actionUpdateEditedCases([{key: null, data: {[key]: value}}]));
		}
	};
}

function updateEditedScenario(scenarioKey, key, value) {
	return (dispatch, getState) => {
		let state = Select.scenarios.getScenario(getState(), scenarioKey);

		// delete property from edited, if the value in update is the same as in state
		if (state && (value === state[key] || (!state[key] && value.length === 0))){
			dispatch(actionRemovePropertyFromEditedScenario(scenarioKey, key));
		} else {
			dispatch(actionUpdateEditedScenarios([{key: scenarioKey, data: {[key]: value}}]));
		}
	};
}

function removeEditedActiveCase() {
	return (dispatch, getState) => {
		let activeCaseKey = Select.scenarios.getActiveCaseKey(getState());
		dispatch(actionRemoveEditedCases([activeCaseKey]));
	};
}

function removeEditedScenario(key) {
	return (dispatch, getState) => {
		dispatch(actionRemoveEditedScenarios([key]));
	};
}

function setActiveCase(key) {
	return (dispatch, getState) => {
		let previousCase = Select.scenarios.getActiveCaseKey(getState());
		dispatch(actionSetActiveCase(key));
		if (key){
			let scenarios = Select.scenarios.getActiveCaseScenarioKeys(getState());
			if (key !== previousCase){
				dispatch(actionSetActiveKeys(scenarios));
			}
		} else {
			dispatch(actionSetActiveKeys(null));
		}
	}
}

function setDefaultSituationActive(active) {
	return (dispatch, getState) => {
		dispatch(actionSetDefaultSituationActive(active));
	};
}

function addActiveScenario(key){
	return (dispatch, getState) => {
		let activeScenarioKeys = Select.scenarios.getActiveKeys(getState());
		let stateUpdate = _.union(activeScenarioKeys, [key]);
		dispatch(actionSetActiveKeys(stateUpdate));
	}
}

function applyDataviewSettings(data){
	return (dispatch, getState) => {

		let scenariosState = Select.scenarios.getAll(getState());
		let casesState = Select.scenarios.getCasesAll(getState());

		// check, if case saved as active still exists
		let activeCase = null;
		if (data && data.cases && casesState && casesState.data){
			let selectedCase = _.find(casesState.data, (storedCase) => {
				return storedCase.key === data.cases.activeKey
			});
			activeCase = selectedCase ? data.cases.activeKey : null;
		}

		// check, if all scenarios save as active still exist
		let activeScenarios = null;
		if (data && data.activeKeys && scenariosState && scenariosState.data){
			activeScenarios = [];
			data.activeKeys.map(activeKey => {
				let scenarioExists = _.find(scenariosState.data, (storedScenario) => {return storedScenario.key === activeKey});
				if (scenarioExists){
					activeScenarios.push(activeKey);
				}
			});
		}

		let stateUpdate = {...scenariosState,
			activeKeys: activeScenarios,
			defaultSituationActive: data.defaultSituationActive,
			cases: {...casesState, activeKey: activeCase}
		};

		dispatch(actionUpdate(stateUpdate));
	}
}

function removeActiveScenario(key){
	return (dispatch, getState) => {
		let activeScenarioKeys = Select.scenarios.getActiveKeys(getState());
		let stateUpdate = _.without(activeScenarioKeys, key);
		dispatch(actionSetActiveKeys(stateUpdate));
	}
}

function update(data){
	return dispatch => {
		dispatch(actionUpdate(data));
	};
}

function load(ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return (dispatch, getState) => {

		let state = getState();
		if (state.scenarios.loading) {
			// already loading, do nothing
		} else {
			dispatch(actionLoadRequest());

			let activePlaceKey = Select.places.getActiveKey(state);

			if (activePlaceKey) {

				let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata/scenarios');

				let payload = {
					place_id: activePlaceKey
				};

				return fetch(url, {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					},
					params: JSON.stringify(payload)
				}).then(
					response => {
						console.log('#### load scenarios response', response);
						let contentType = response.headers.get('Content-type');
						if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
							return response.json().then(data => {
								if (data) {
									dispatch(loadReceive(data));
								} else {
									dispatch(actionLoadError('no data returned'));
								}
							});
						} else {
							dispatch(actionLoadError(response))
						}
					},
					error => {
						console.log('#### load scenarios error', error);
						if (ttl - 1) {
							dispatch(load(ttl - 1));
						} else {
							dispatch(actionLoadError("scenarios#actions load: scenarios weren't loaded!"));
						}
					}
				);

			} else {
				dispatch(actionLoadError('scenarios#actions load: no active place'));
			}

		}

	};
}

function loadReceive(data) {
	return dispatch => {
		//data = _.map(data, feature => {
		//	return {
		//		key: feature.properties[aoiLayer.fidColumn || 'fid'],
		//		code: feature.properties[aoiLayer.idColumn]
		//	};
		//});
		console.log('#########', data);
		//dispatch(actionLoadReceive(data));
	};
}

function loadCases(ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return (dispatch, getState) => {

		let state = getState();
		if (state.scenarios.loading) {
			// already loading, do nothing
		} else {
			dispatch(actionLoadCasesRequest());

			let activePlaceKey = Select.places.getActiveKey(state);

			if (activePlaceKey) {

				let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata/scenario_cases');

				let payload = {
					place_id: activePlaceKey
				};

				return fetch(url, {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					},
					params: JSON.stringify(payload)
				}).then(
					response => {
						console.log('#### load scenarios cases response', response);
						let contentType = response.headers.get('Content-type');
						if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
							return response.json().then(data => {
								if (data.data) {
									dispatch(loadCasesReceive(data.data));
								} else {
									dispatch(actionLoadCasesError('no data returned'));
								}
							});
						} else {
							dispatch(actionLoadCasesError(response))
						}
					},
					error => {
						console.log('#### load scenario cases error', error);
						if (ttl - 1) {
							dispatch(load(ttl - 1));
						} else {
							dispatch(actionLoadCasesError("scenarios#actions load cases: cases weren't loaded!"));
						}
					}
				);

			} else {
				dispatch(actionLoadCasesError('scenarios#actions load cases: no active place'));
			}

		}

	};
}

function loadCasesReceive(data) {
	return dispatch => {
		data = _.map(data, ({id, geometry, ...model}) => {
			return {...model, key: id, geometry: JSON.parse(geometry)};
		});
		dispatch(actionLoadCasesReceive(data));
	};
}

function saveActiveCase() {
	return (dispatch, getState) => {
		let state = getState();
		let saved = Select.scenarios.getActiveCase(state);
		let edited = Select.scenarios.getActiveCaseEdited(state);
		let activePlaceKey = Select.places.getActiveKey(state);

		if (saved) {
			// update
		} else {
			// create
		}
	};
}

// ============ actions ===========

function actionAdd(scenarios) {
	return {
		type: ActionTypes.SCENARIOS_ADD,
		data: scenarios
	}
}

function actionSetActive(scenario) {
	return {
		type: ActionTypes.SCENARIOS_SET_ACTIVE,
		data: scenario
	}
}

function actionSetActiveKeys(scenarios) {
	return {
		type: ActionTypes.SCENARIOS_SET_ACTIVE_MULTI,
		keys: scenarios
	}
}

function actionSetActiveCase(caseKey) {
	return {
		type: ActionTypes.SCENARIOS_CASES_SET_ACTIVE,
		key: caseKey
	}
}

function actionSetDefaultSituationActive(active) {
	return {
		type: ActionTypes.SCENARIOS_SET_DEFAULT_SITUATION_ACTIVE,
		active: active
	}
}

function actionUpdate(data) {
	return {
		type: ActionTypes.SCENARIOS_UPDATE,
		data: data
	}
}

function actionLoadRequest() {
	return {
		type: ActionTypes.SCENARIOS_REQUEST
	}
}

function actionLoadReceive(data) {
	return {
		type: ActionTypes.SCENARIOS_RECEIVE,
		data: data
	}
}

function actionLoadError(error) {
	return {
		type: ActionTypes.SCENARIOS_REQUEST_ERROR,
		error: error
	}
}

function actionLoadCasesRequest() {
	return {
		type: ActionTypes.SCENARIOS_CASES_REQUEST
	}
}

function actionLoadCasesReceive(data) {
	return {
		type: ActionTypes.SCENARIOS_CASES_RECEIVE,
		data: data
	}
}

function actionLoadCasesError(error) {
	return {
		type: ActionTypes.SCENARIOS_CASES_REQUEST_ERROR,
		error: error
	}
}

function actionUpdateEditedCases(data) {
	return {
		type: ActionTypes.SCENARIOS_CASES_EDITED_UPDATE,
		data: data
	}
}
function actionUpdateEditedScenarios(data) {
	return {
		type: ActionTypes.SCENARIOS_EDITED_UPDATE,
		data: data
	}
}
function actionRemoveEditedCases(keys) {
	return {
		type: ActionTypes.SCENARIOS_CASES_EDITED_REMOVE,
		keys: keys
	}
}
function actionRemovePropertyFromEditedCase(caseKey, property) {
	return {
		type: ActionTypes.SCENARIOS_CASE_EDITED_REMOVE_PROPERTY,
		caseKey: caseKey,
		property: property
	}
}
function actionRemoveEditedScenarios(keys) {
	return {
		type: ActionTypes.SCENARIOS_EDITED_REMOVE,
		keys: keys
	}
}

function actionRemovePropertyFromEditedScenario(scenarioKey, property) {
	return {
		type: ActionTypes.SCENARIOS_EDITED_REMOVE_PROPERTY,
		scenarioKey: scenarioKey,
		property: property
	}
}

// ============ export ===========

export default {
	add: add,
	addActiveScenario: addActiveScenario,
	applyDataviewSettings: applyDataviewSettings,
	removeActiveScenario: removeActiveScenario,
	setActive: setActive,
	setActiveCase: setActiveCase,
	setDefaultSituationActive: setDefaultSituationActive,
	update: update,
	load: load,
	loadCases: loadCases,
	updateEditedActiveCase: updateEditedActiveCase,
	updateEditedScenario: updateEditedScenario,
	removeEditedActiveCase: removeEditedActiveCase,
	removeEditedScenario: removeEditedScenario,
	saveActiveCase: saveActiveCase
}

