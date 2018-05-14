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

				let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/scenarios/get');

				let payload = {
					place_id: activePlaceKey
				};

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
	load: load
}

