import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	data: null,
	activeScopeKey: null
};

function addDistinct(state, action) {
	return {...state, data: (state.data ? [...state.data, ...action.data] : action.data)};
}

function setActiveKey(state, action){
	return {...state, activeScopeKey: action.activeScopeKey};
}

export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.SCOPES_ADD:
			return addDistinct(state, action);
		case ActionTypes.SCOPES_SET_ACTIVE_KEY:
			return setActiveKey(state, action);
		default:
			return state;
	}
}
