import Action from '../Action';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import config from '../../config';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';
import queryString from 'query-string';

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
		let state = getState();
		let activeCaseKey = Select.scenarios.getActiveCaseKey(state);
		let activeCase = Select.scenarios.getActiveCase(state);
		let sameCoordinates = false;

		if (activeCase && activeCase.data){
			if (key === 'geometry' && activeCase.data.geometry){
				let geometry = _.cloneDeep(activeCase.data.geometry);
				sameCoordinates = JSON.stringify(value.coordinates) === JSON.stringify(geometry.coordinates);
			}
			if (sameCoordinates || (value === activeCase.data[key]) || (!activeCase.data[key] && value.length === 0)){
				dispatch(actionRemovePropertyFromEditedCase(activeCaseKey, key));
			} else {
				dispatch(actionUpdateEditedCases([{key: activeCaseKey, data: {[key]: value}}]));
			}
		} else {
			dispatch(actionUpdateEditedCases([{key: activeCaseKey, data: {[key]: value}}]));
		}
	};
}

function updateEditedScenario(scenarioKey, key, value) {
	return (dispatch, getState) => {
		let scenario = Select.scenarios.getScenario(getState(), scenarioKey);

		// delete property from edited, if the value in update is the same as in state
		if (scenario && (value === scenario.data[key] || (!scenario.data[key] && value.length === 0))){
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

		let state = getState();
		let scenariosState = Select.scenarios.getAll(state);
		let casesState = Select.scenarios.getCasesAll(state);

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

function updateCases(data){
	return dispatch => {
		dispatch(actionUpdateCases(data));
	};
}

function load(caseKey, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return (dispatch, getState) => {

		let state = getState();
		if (state.scenarios.loading) {
			// already loading, do nothing
		} else {
			dispatch(actionLoadRequest(caseKey));

			//let activePlaceKey = Select.places.getActiveKey(state);

			//if (activePlaceKey) {

				let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata/scenarios');
				let query = queryString.stringify({
					scenario_case_id: caseKey
				});
				if (query) {
					url += '?' + query;
				}

				return fetch(url, {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					}
				}).then(
					response => {
						console.log('#### load scenarios response', response);
						let contentType = response.headers.get('Content-type');
						if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
							return response.json().then(data => {
								if (data.data) {
									dispatch(loadReceive(data.data)); //todo cancel loading for caseKey?
									dispatch(scenariosLoadedForCase(caseKey));
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
							dispatch(load(caseKey, ttl - 1));
						} else {
							dispatch(actionLoadError("scenarios#actions load: scenarios weren't loaded!"));
						}
					}
				);

			//} else {
			//	dispatch(actionLoadError('scenarios#actions load: no active place'));
			//}

		}

	};
}

function loadReceive(data) {
	return dispatch => {
		data = _.map(data, ({id, ...model}) => {
			return {...model, key: id};
		});
		dispatch(actionLoadReceive(data));
	};
}

function scenariosLoadedForCase(caseKey){
	return (dispatch, getState) => {
		let state = getState();
		let casesState = Select.scenarios.getCasesAll(state);
		let casesData = Select.scenarios.getCases(state);
		let activeCaseKey = Select.scenarios.getActiveCaseKey(state);

		let updatedData = [];
		_.each(casesData, model => {
			if (model.key === activeCaseKey) {
				updatedData.push({...model, scenariosLoaded: true});
			} else {
				updatedData.push(model);
			}
		});
		let stateUpdate = {...casesState, data: updatedData};
		dispatch(updateCases(stateUpdate));
		dispatch(Action.maps.updateWithScenarios());
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
				let query = queryString.stringify({
					place_id: activePlaceKey
				});
				if (query) {
					url += '?' + query;
				}

				return fetch(url, {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					}
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
							dispatch(loadCases(ttl - 1));
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

function loadCasesReceive(models) {
	return dispatch => {
		models = _.map(models, ({id, data, ...model}) => {
			let {scenario_ids, ...modelData} = data;
			return {...model, key: id, data: {...modelData, geometry: JSON.parse(modelData.geometry), scenarios: scenario_ids}};
		});
		dispatch(actionLoadCasesReceive(models));
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
			dispatch(apiUpdateCases([edited]));
		} else {
			// create
			dispatch(apiCreateCases([edited], activePlaceKey));
		}
	};
}

function apiCreateCases(updates, placeKey, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return dispatch => {
		dispatch(actionApiCreateCasesRequest(_.map(updates, 'key')));

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata/scenario_cases');

		let payload = _.map(updates, update => {
			return {
				uuid: update.key,
				data: {...update.data, place_id: placeKey}
			};
		});

		return fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(payload)
		}).then(
			response => {
				console.log('#### create scenario cases response', response);
				let contentType = response.headers.get('Content-type');
				if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
					return response.json().then(data => {
						if (data.data) {
							dispatch(apiCreateCasesReceive(data.data));
						} else {
							dispatch(actionApiCreateCasesError('no data returned'));
						}
					});
				} else {
					dispatch(actionApiCreateCasesError(response))
				}
			},
			error => {
				console.log('#### create scenario case error', error);
				if (ttl - 1) {
					dispatch(apiCreateCases(updates, placeKey, ttl - 1));
				} else {
					dispatch(actionApiCreateCasesError("scenarios#actions create cases: cases weren't created!"));
				}
			}
		);
	};
}

function apiUpdateCases(updates, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return dispatch => {
		dispatch(actionApiUpdateCasesRequest(_.map(updates, 'key')));

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata/scenario_cases');

		let payload = _.map(updates, update => {
			return {
				id: update.key,
				data: update.data
			};
		});

		return fetch(url, {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(payload)
		}).then(
			response => {
				console.log('#### update scenario case response', response);
				let contentType = response.headers.get('Content-type');
				if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
					return response.json().then(data => {
						if (data.data) {
							//dispatch(loadCasesReceive(data.data));
						} else {
							//dispatch(actionLoadCasesError('no data returned'));
						}
					});
				} else {
					//dispatch(actionLoadCasesError(response))
				}
			},
			error => {
				console.log('#### update scenario case error', error);
				if (ttl - 1) {
					dispatch(apiUpdateCases(updates, ttl - 1));
				} else {
					//dispatch(actionLoadCasesError("scenarios#actions load cases: cases weren't loaded!"));
				}
			}
		);
	};
}

function apiCreateCasesReceive(data) {
	return (dispatch, getState) => {
		// add to data
		//let oldStructureData = _.map(data, model => {
		//	return {
		//		id: model.id,
		//		...model.data
		//	};
		//});
		dispatch(loadCasesReceive(data));
		// change active key if of temporary case
		let activeCaseKey = Select.scenarios.getActiveCaseKey(getState());
		if (activeCaseKey) {
			let activeCaseCreated = _.find(data, {uuid: activeCaseKey});
			if (activeCaseCreated) {
				dispatch(actionSetActiveCase(activeCaseCreated.id));
			}
		}
		// remove from editedData
		dispatch(actionRemoveEditedCases(_.map(data, 'uuid')));
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

function actionUpdateCases(data) {
	return {
		type: ActionTypes.SCENARIOS_CASES_UPDATE,
		data: data
	}
}

function actionLoadRequest(caseKey) {
	return {
		type: ActionTypes.SCENARIOS_REQUEST,
		caseKey: caseKey
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

function actionApiCreateCasesRequest(keys) {
	return {
		type: ActionTypes.SCENARIOS_CASES_API_CREATE_REQUEST,
		keys: keys
	}
}

function actionApiCreateCasesReceive(data) {
	return {
		type: ActionTypes.SCENARIOS_CASES_API_CREATE_RECEIVE,
		data: data
	}
}

function actionApiCreateCasesError(error) {
	return {
		type: ActionTypes.SCENARIOS_CASES_API_CREATE_ERROR,
		error: error
	}
}

function actionApiUpdateCasesRequest(keys) {
	return {
		type: ActionTypes.SCENARIOS_CASES_API_UPDATE_REQUEST,
		keys: keys
	}
}

function actionApiUpdateCasesReceive(data) {
	return {
		type: ActionTypes.SCENARIOS_CASES_API_UPDATE_RECEIVE,
		data: data
	}
}

function actionApiUpdateCasesError(error) {
	return {
		type: ActionTypes.SCENARIOS_CASES_API_UPDATE_ERROR,
		error: error
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

