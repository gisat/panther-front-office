import ActionTypes from '../../constants/ActionTypes';
import Action from '../Action';
import _ from 'lodash';

const INITIAL_STATE = {
	activeMapKey: null,
	defaults: null,
	data: null,
	initialized: false,
	independentOfPeriod: false
};


function add(state, action) {
	let data = (state.data && state.data.length) ? [...state.data, ...action.data] : [...action.data];
	return {...state, data: data};
}

function remove(state, action) {
	let data = _.reject(state.data, map => {
		return _.includes(action.keys, map.key);
	});
	return {...state, data: data};
}

function update(state, action) {
	let data = _.map(state.data, map => {
		let mapUpdate = _.find(action.data, {key: map.key});
		if (mapUpdate) {
			return _.merge(map, mapUpdate);
		} else {
			return map;
		}
	});
	return {...state, data: data};
}

function updateDefaults(state, action) {
	return {...state, defaults: state.defaults ? _.merge(state.defaults, action.defaults) : action.defaults};
}

function setActive(state, action) {
	return {...state, activeMapKey: action.key};
}

function setIndependentOfPeriod(state, action) {
	return {...state, independentOfPeriod: action.independent};
}

function initialize(state, action) {
	return {...state, initialized: true};
}


export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.INITIALIZE:
			return initialize(state, action);
		case ActionTypes.MAPS_ADD:
			return add(state, action);
		case ActionTypes.MAPS_REMOVE:
			return remove(state, action);
		case ActionTypes.MAPS_UPDATE:
			return update(state, action);
		case ActionTypes.MAPS_UPDATE_DEFAULTS:
			return updateDefaults(state, action);
		case ActionTypes.MAPS_SET_ACTIVE:
			return setActive(state, action);
		case ActionTypes.MAPS_SET_INDEPENDENT_OF_PERIOD:
			return setIndependentOfPeriod(state, action);
		default:
			return state;
	}
}
