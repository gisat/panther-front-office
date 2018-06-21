import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	data: null,
	activeKey: null,
	activeKeys: null
};

function add(state, action) {
	return {...state, data: (state.data ? [...state.data, ...action.data] : action.data)};
}

function setActive(state, action){
	return {...state, activeKey: action.key, activeKeys: null};
}

function setActiveMultiple(state, action){
	return {...state, activeKeys: action.keys, activeKey: null};
}

export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.PLACES_ADD:
			return add(state, action);
		case ActionTypes.PLACES_SET_ACTIVE:
			return setActive(state, action);
		case ActionTypes.PLACES_SET_ACTIVE_MULTI:
			return setActiveMultiple(state, action);
		default:
			return state;
	}
}
