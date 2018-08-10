import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	data: [],
	activeKey: null
};

function add(state, action) {
	return {...state, data: (state.data ? [...state.data, ...action.data] : action.data)};
}

function receive(state, action) {
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

function remove(state, action){
	let data = _.reject(state.data, view => {
		return _.includes(action.keys, view.key);
	});
	return {...state, data: data};
}

function setActive(state, action) {
	return {
		...state,
		activeKey: action.key
	}
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.VIEWS_ADD:
			return receive(state, action);
		case ActionTypes.VIEWS_REMOVE:
			return remove(state, action);
		case ActionTypes.VIEWS_SET_ACTIVE:
			return setActive(state, action);
		default:
			return state;
	}
}
