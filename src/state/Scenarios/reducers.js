import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

//const INITIAL_STATE = {
//	activeKey: null,
//	activeKeys: null,
//	data: null,
//	loading: false,
//	cases: {
//		activeKey: null,
//		data: null,
//		loading: false
//	}
//};

const INITIAL_STATE = {
	activeKey: null,
	activeKeys: null,
	defaultSituationActive: true,
	data: [
		{key: 9999991, name: "Scenario 1", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis."},
		{key: 9999992, name: "Scenario 2"},
		{key: 9999993, name: "Scenario 3"},
		{key: 9999994, name: "Scenario 4", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis."},
		{key: 9999995, name: "Scenario 5"},
		{key: 9999996, name: "Scenario 6"}
	],
	loading: false,
	cases: {
		activeKey: null,
		data: [
			{key: 9999991, name: "Prague", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis.", scenarios: [9999991,9999992,9999993], geometry: {
					"type": "Polygon",
					"coordinates":
						[[
							[
								14.23004150390625,
								50.0536119068041
							],
							[
								14.23004150390625,
								50.11793646935709
							],
							[
								14.418182373046873,
								50.11793646935709
							],
							[
								14.418182373046873,
								50.0536119068041
							],
							[
								14.23004150390625,
								50.0536119068041
							]
						]
					]
				}},
			{key: 9999992, name: "Letenská pláň (without desc)", scenarios: [9999994,9999995], geometry: {
					"type": "Polygon",
					"coordinates": [
						[
							[
								14.405908584594727,
								50.09217295121259
							],
							[
								14.405908584594727,
								50.09905558914327
							],
							[
								14.4305419921875,
								50.09905558914327
							],
							[
								14.4305419921875,
								50.09217295121259
							],
							[
								14.405908584594727,
								50.09217295121259
							]
						]
					]
				}},
			{key: 9999993, name: "Without location", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis.", scenarios: [9999996]},
			{key: 9999994, name: "Without scenario", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis."},
			{key: 9999995, name: "Added after dataview was created"}
		],
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
	// save user data
	let data = (state.data && state.data.length) ? [...state.data, ...action.data] : [...action.data];
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
	// save user data
	let data = (state.cases.data && state.cases.data.length) ? [...state.cases.data, ...action.data] : [...action.data];
	return {...state, cases: {...state.cases, loading: false, data: data}};
}

function update(state, action){
	return {...state, ...action.data}
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.SCENARIOS_ADD:
			return addDistinct(state, action);
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
		case ActionTypes.SCENARIOS_UPDATE:
			return update(state, action);
		default:
			return state;
	}
}
