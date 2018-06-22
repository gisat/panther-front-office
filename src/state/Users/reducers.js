import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	isLoggedIn: false,
	isAdmin: false,
	activeKey: null,
	data: []
};

function add(state, action) {
	return {...state, data: (state.data ? [...state.data, ...action.data] : action.data)};
}

function update(state, action) {
	let {userId, ...data} = action.data;
	data.activeKey = action.data.userId;

	return {...state, ...data};
}

export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.USERS_ADD:
			return add(state, action);
		case ActionTypes.USERS_UPDATE:
			return update(state, action);
		default:
			return state;
	}
}
