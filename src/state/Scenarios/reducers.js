import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	activeKey: null,
	activeKeys: null,
	data: null,
	loading: false,
	cases: {
		activeKey: null,
		data: null,
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
	return {...state, activeKeys: action.keys};
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

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.SCENARIOS_ADD:
			return addDistinct(state, action);
		case ActionTypes.SCENARIOS_SET_ACTIVE:
			return setActive(state, action);
		case ActionTypes.SCENARIOS_SET_ACTIVE_MULTI:
			return setActiveKeys(state, action);
		case ActionTypes.SCENARIOS_CASES_ADD:
			return addCasesDistinct(state, action);
		case ActionTypes.SCENARIOS_CASES_SET_ACTIVE:
			return setActiveCase(state, action);
		default:
			return state;
	}
}
