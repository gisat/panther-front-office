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
		{key: 1, name: "Scenario 1", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis."},
		{key: 2, name: "Scenario 2"},
		{key: 3, name: "Scenario 3"},
		{key: 4, name: "Scenario 4", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis."},
		{key: 5, name: "Scenario 5"},
		{key: 6, name: "Scenario 6"}
	],
	loading: false,
	cases: {
		activeKey: null,
		data: [
			{key: 1, name: "Case blabla wtf 123", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis.", scenarios: [1,2,3], geometry: {
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
			{key: 2, name: "Omg another case 45", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit.", scenarios: [4,5]},
			{key: 3, name: "aaaaaaaaaaaaaa case 6", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis.", scenarios: [6]},
			{key: 11, name: "Case blabla wtf 123", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis.", scenarios: [1,2,3]},
			{key: 21, name: "Omg another case 45", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis.", scenarios: [4,5]},
			{key: 31, name: "aaaaaaaaaaaaaa case 6", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis.", scenarios: [6]},
			{key: 12, name: "Case blabla wtf 123", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis.", scenarios: [1,2,3]},
			{key: 22, name: "Omg another case 45", description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin in tellus sit amet nibh dignissim sagittis.", scenarios: [4,5]},
			{key: 32, name: "aaaaaaaaaaaaaa case 6", scenarios: [6]}

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
