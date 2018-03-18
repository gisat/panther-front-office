import ActionTypes from '../../constants/ActionTypes';
import Action from '../Action';
import _ from 'lodash';

const INITIAL_STATE = {
	activeKey: null,
	data: null,
	loading: false
};


function setActive(state, action) {
	return {...state, activeKey: action.key};
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


export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.AOI_REQUEST:
			return request(state, action);
		case ActionTypes.AOI_RECEIVE:
			return receive(state, action);
		case ActionTypes.AOI_REQUEST_ERROR:
			return requestError(state, action);
		case ActionTypes.AOI_SET_ACTIVE:
			return setActive(state, action);
		default:
			return state;
	}
}
