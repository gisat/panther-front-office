import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	isLoggedIn: false,
	isAdmin: false
};

function update(state, action) {
	return {...state, ...action.data};
}

export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.USER_UPDATE:
			return update(state, action);
		default:
			return state;
	}
}
