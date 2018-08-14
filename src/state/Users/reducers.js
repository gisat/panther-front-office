import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	isLoggedIn: false,
	isAdmin: false,
	activeKey: null,
	data: []
};

function addDistinct(state, action) {
	let data;
	if (state.data && state.data.length) {
		// remove old versions of received models
		let oldData = _.reject(state.data, model => {
			return _.find(action.data, {key: model.key});
		});
		data = [...oldData, ...action.data];
	} else {
		data = [...action.data];
	}
	return {...state, loading: false, data: data};
}

function update(state, action) {
	let {userId, ...data} = action.data;
	data.activeKey = action.data.userId;

	return {...state, ...data};
}

function loadRequest(state, action) {
	return {...state, loading: true};
}
function loadRequestError(state, action) {
	return {...state, loading: false};
}

export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.USERS_ADD:
			return addDistinct(state, action);
		case ActionTypes.USERS_LOAD_REQUEST:
			return loadRequest(state, action);
		case ActionTypes.USERS_LOAD_REQUEST_ERROR:
			return loadRequestError(state, action);
		case ActionTypes.USERS_UPDATE:
			return update(state, action);
		default:
			return state;
	}
}
