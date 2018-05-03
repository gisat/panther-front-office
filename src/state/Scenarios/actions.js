import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import _ from 'lodash';


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

// ============ export ===========

export default {
	add: add,
	addActiveScenario: addActiveScenario,
	removeActiveScenario: removeActiveScenario,
	setActive: setActive,
	setActiveCase: setActiveCase,
	setDefaultSituationActive: setDefaultSituationActive,
	update: update
}

