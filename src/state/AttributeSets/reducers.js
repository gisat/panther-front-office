import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	activeKeys: null,
	data: null
};

function add(state, action) {
	return {...state, data: (state.data ? [...state.data, ...action.data] : action.data)};
}

function setActiveMultiple(state, action){
	return {...state, activeKeys: action.keys};
}

export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.ATTRIBUTE_SETS_ADD:
			return add(state, action);
		case ActionTypes.ATTRIBUTE_SETS_SET_ACTIVE_MULTI:
			return setActiveMultiple(state, action);
		default:
			return state;
	}
}
