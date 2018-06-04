import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	isLoggedIn: false,
	isAdmin: false,
	data: []
};

function addDistinct(state, action) {
	let data;
	if (state.data && state.data.length){
		let newData = _.reject(action.data, user => {
			return _.find(state.data, {key: user.key});
		});
		data = state.data.concat(newData);
	} else {
		data = [...action.data];
	}
	return {...state, data: data};
}

function update(state, action) {
	return {...state, ...action.data};
}

export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.USERS_ADD:
			return addDistinct(state, action);
		case ActionTypes.USERS_UPDATE:
			return update(state, action);
		default:
			return state;
	}
}
