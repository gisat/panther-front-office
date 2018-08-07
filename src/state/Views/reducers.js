import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	data: [],
	activeKey: null
};

function add(state, action) {
	return {...state, data: (state.data ? [...state.data, ...action.data] : action.data)};
}

function addDistinct(state, action){
	let data;
	if (state.data && state.data.length){
		let newData = _.reject(action.data, model => {
			return _.find(state.data, {key: model.key});
		});
		data = [...state.data, ...newData];
	} else {
		data = [...action.data];
	}
	return {...state, data: data};
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
			return addDistinct(state, action);
		case ActionTypes.VIEWS_REMOVE:
			return remove(state, action);
		case ActionTypes.VIEWS_SET_ACTIVE:
			return setActive(state, action);
		default:
			return state;
	}
}
