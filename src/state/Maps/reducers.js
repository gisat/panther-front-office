import ActionTypes from '../../constants/ActionTypes';
import Action from '../Action';

const INITIAL_STATE = {
	defaults: null,
	data: null
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


export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.MAPS_ADD:
			return add(state, action);
		case ActionTypes.MAPS_REMOVE:
			return remove(state, action);
		case ActionTypes.MAPS_UPDATE:
			return update(state, action);
		case ActionTypes.MAPS_UPDATE_DEFAULTS:
			return updateDefaults(state, action);
		default:
			return state;
	}
}
