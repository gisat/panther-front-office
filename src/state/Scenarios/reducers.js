import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import { buildCleaner } from 'lodash-clean';


const INITIAL_STATE = {
	activeKey: null,
	activeKeys: null,
	defaultSituationActive: true,
	data: [],
	editedData: [],
	loading: false,
	cases: {
		activeKey: null,
		data: [],
		editedData: [],
		loading: false
	}
};


function addDistinct(state, action) {
	let data;
	if (state.data && state.data.length){
		let newData = _.reject(action.data, model => {
			return _.find(state.data, {key: model.key});
		});
		data = [...state.data, ...newData];
	} else {
		data = [...action.data];
	}
	return {...state, data: data};
}

function setActive(state, action){
	return {...state, activeKey: action.key};
}

function setActiveKeys(state, action){
	return {...state, activeKeys: action.keys ? action.keys : null};
}

function request(state, action) {
	return {...state, loading: true};
}

function requestError(state, action) {
	// message action
	return {...state, loading: false};
}

function receive(state, action) {
	let data;
	if (state.data && state.data.length) {
		// update old versions of received models
		let oldData = _.map(state.data, model => {
			let newModel = _.find(action.data, {key: model.key});
			if (newModel){
				return {...model, ...newModel}
			} else {
				return model;
			}
		});
		data = [...oldData, ...action.data];
	} else {
		data = [...action.data];
	}
	return {...state, loading: false, data: data};
}


function addCasesDistinct(state, action) {
	return {...state, cases: addDistinct(state.cases, action)};
}

function setActiveCase(state, action){
	return {...state, cases: {...state.cases, activeKey: action.key}};
}

function setDefaultSituationActive(state, action){
	return {...state, defaultSituationActive: action.active};
}

function requestCases(state, action) {
	return {...state, cases: {...state.cases, loading: true}};
}

function requestCasesError(state, action) {
	// message action
	return {...state, cases: {...state.cases, loading: false}};
}

function receiveCases(state, action) {
	let data;
	if (state.cases.data && state.cases.data.length) {
		// remove old versions of received models
		let oldData = _.reject(state.cases.data, model => {
			return _.find(action.data, {key: model.key});
		});
		data = [...oldData, ...action.data];
	} else {
		data = [...action.data];
	}
	return {...state, cases: {...state.cases, loading: false, data: data}};
}

function updateEditedCases(state, action) {
	let data;
	if (state.cases.editedData && state.cases.editedData.length) {
		// update old versions of received models
		let oldCases = _.map(state.cases.editedData, model => {
			let update = _.find(action.data, {key: model.key});
			if (update) {
				return {...model, data: {...model.data, ...update.data}};
			} else {
				return model;
			}
		});
		// clear updated old cases from new
		let newCases = _.reject(action.data, update => {
			return _.find(oldCases, {key: update.key});
		});
		data = [...oldCases, ...newCases];
	} else {
		data = [...action.data];
	}
	return {...state, cases: {...state.cases, editedData: data}};
}

function updateEditedScenarios(state, action) {
	let data;
	if (state.editedData && state.editedData.length) {
		// update old versions of received models
		let oldScenarios = _.map(state.editedData, model => {
			let update = _.find(action.data, {key: model.key});
			if (update) {
				return {...model, data: {...model.data, ...update.data}};
			} else {
				return model;
			}
		});
		// clear updated old cases from new
		let newScenarios = _.reject(action.data, update => {
			return _.find(oldScenarios, {key: update.key});
		});
		data = [...oldScenarios, ...newScenarios];
	} else {
		data = [...action.data];
	}
	return {...state, editedData: data};
}

function removeEditedCases(state, action) {
	return {...state, cases: {...state.cases, editedData: _.reject(state.cases.editedData, editedCase => {
		return _.includes(action.keys, editedCase.key);
	})}};
}

function removeEditedScenarios(state, action) {
	return {...state, editedData: _.reject(state.editedData, editedCase => {
				return _.includes(action.keys, editedCase.key);
			})};
}

function removeEditedCaseProperty(state, action) {

	let editedData = [];
	_.each(state.cases.editedData, model => {
		if (model.key === action.caseKey) {
			let newModelData = _.omit(model.data, action.property);
			if (Object.keys(newModelData).length) {
				editedData.push({...model, data: newModelData})
			} else {
				// we removed last property, do nothing
			}
		} else {
			editedData.push(model);
		}
	});

	return {...state, cases: {...state.cases, editedData: editedData}};
}

function removeEditedScenarioProperty(state, action) {

	let editedData = [];
	_.each(state.editedData, model => {
		if (model.key === action.scenarioKey) {
			let newModelData = _.omit(model.data, action.property);
			if (Object.keys(newModelData).length) {
				editedData.push({...model, data: newModelData})
			} else {
				// we removed last property, do nothing
			}
		} else {
			editedData.push(model);
		}
	});

	return {...state, editedData: editedData};
}

function update(state, action){
	return {...state, ...action.data}
}

function updateCases(state, action){
	return {...state, cases: {...state.cases, ...action.data}}
}

function updateScenario(state, action){
	let updatedData = [];
	_.each(state.data, model => {
		if (model.key === action.data.key) {
			let newModelData = {...model, ...action.data};
			updatedData.push(newModelData);
		} else {
			updatedData.push(model);
		}
	});
	if (action.data && action.data.fileProcessing && action.data.fileProcessing.message){
		console.error(action.data.fileProcessing.message);
	}
	return {...state, data: updatedData};
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.SCENARIOS_ADD:
			return addDistinct(state, action);
		case ActionTypes.SCENARIOS_EDITED_UPDATE:
			return updateEditedScenarios(state, action);
		case ActionTypes.SCENARIOS_EDITED_REMOVE:
			return removeEditedScenarios(state, action);
		case ActionTypes.SCENARIOS_EDITED_REMOVE_PROPERTY:
			return removeEditedScenarioProperty(state, action);
		case ActionTypes.SCENARIOS_SET_ACTIVE:
			return setActive(state, action);
		case ActionTypes.SCENARIOS_SET_ACTIVE_MULTI:
			return setActiveKeys(state, action);
		case ActionTypes.SCENARIOS_SET_DEFAULT_SITUATION_ACTIVE:
			return setDefaultSituationActive(state, action);
		case ActionTypes.SCENARIOS_CASES_ADD:
			return addCasesDistinct(state, action);
		case ActionTypes.SCENARIOS_CASES_SET_ACTIVE:
			return setActiveCase(state, action);
		case ActionTypes.SCENARIOS_CASES_UPDATE:
			return updateCases(state, action);
		case ActionTypes.SCENARIOS_UPDATE:
			return update(state, action);
		case ActionTypes.SCENARIOS_RECEIVE:
			return receive(state, action);
		case ActionTypes.SCENARIOS_REQUEST:
			return request(state, action);
		case ActionTypes.SCENARIOS_REQUEST_ERROR:
			return requestError(state, action);
		case ActionTypes.SCENARIOS_CASES_RECEIVE:
			return receiveCases(state, action);
		case ActionTypes.SCENARIOS_CASES_EDITED_UPDATE:
			return updateEditedCases(state, action);
		case ActionTypes.SCENARIOS_CASES_EDITED_REMOVE:
			return removeEditedCases(state, action);
		case ActionTypes.SCENARIOS_CASE_EDITED_REMOVE_PROPERTY:
			return removeEditedCaseProperty(state, action);
		case ActionTypes.SCENARIOS_API_PROCESSING_FILE_ERROR:
			return updateScenario(state, action);
		case ActionTypes.SCENARIOS_API_PROCESSING_FILE_STARTED:
			return updateScenario(state, action);
		case ActionTypes.SCENARIOS_API_PROCESSING_FILE_SUCCESS:
			return updateScenario(state, action);
		default:
			return state;
	}
}
