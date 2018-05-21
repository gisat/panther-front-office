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

const lodashClean = buildCleaner({
	isNull: _.noop,
	isString: _.identity
});

//const INITIAL_STATE = {
//	activeKey: null,
//	activeKeys: null,
//	defaultSituationActive: true,
//	data: [
//		{key: 9999991, name: "Scenario 1", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis."},
//		{key: 9999992, name: "Scenario 2"},
//		{key: 9999993, name: "Scenario 3"},
//		{key: 9999994, name: "Scenario 4", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis."},
//		{key: 9999995, name: "Scenario 5"},
//		{key: 9999996, name: "Scenario 6"}
//	],
//	editedData: null,
//	loading: false,
//	cases: {
//		activeKey: null,
//		data: [
//			{key: 9999991, name: "Prague", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis.", scenarios: [9999991,9999992,9999993], geometry: {
//				"type": "Polygon",
//				"coordinates":
//					[[
//						[
//							14.23004150390625,
//							50.0536119068041
//						],
//						[
//							14.23004150390625,
//							50.11793646935709
//						],
//						[
//							14.418182373046873,
//							50.11793646935709
//						],
//						[
//							14.418182373046873,
//							50.0536119068041
//						],
//						[
//							14.23004150390625,
//							50.0536119068041
//						]
//					]
//					]
//			}},
//			{key: 9999992, name: "Letenská pláň (without desc)", scenarios: [9999994,9999995], geometry: {
//				"type": "Polygon",
//				"coordinates": [
//					[
//						[
//							14.405908584594727,
//							50.09217295121259
//						],
//						[
//							14.405908584594727,
//							50.09905558914327
//						],
//						[
//							14.4305419921875,
//							50.09905558914327
//						],
//						[
//							14.4305419921875,
//							50.09217295121259
//						],
//						[
//							14.405908584594727,
//							50.09217295121259
//						]
//					]
//				]
//			}},
//			{key: 9999993, name: "Without location", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis.", scenarios: [9999996]},
//			{key: 9999994, name: "Without scenario", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis."},
//			{key: 9999995, name: "Added after dataview was created"}
//		],
//		editedData: null,
//		loading: false
//	}
//};

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
		// remove old versions of received models
		let oldData = _.reject(state.data, model => {
			return _.find(action.data, {key: model.key});
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
				let oldCase = {...model, data: {...model.data, ...update.data}};
				// clean null property values and empty objects
				return lodashClean(oldCase);
			} else {
				return model;
			}
		});
		// clear updated old cases from new
		let newCases = _.reject(action.data, update => {
			return _.find(oldCases, {key: update.key});
		});
		let updatedData = [...oldCases, ...newCases];
		data = _.reject(updatedData, updatedCase => {
			let keys = _.keys(updatedCase);
			return (keys && keys.length === 1 && keys[0] === 'key')
		});
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
		default:
			return state;
	}
}
