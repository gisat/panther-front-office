import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	data: null
};

function add(state, action) {
	return {...state, data: (state.data ? [...state.data, ...action.data] : action.data)};
}

function remove(state, action){
	let data = _.reject(state.data, view => {
		return _.includes(action.keys, view.key);
	});
	return {...state, data: data};
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.VIEWS_ADD:
			return add(state, action);
		case ActionTypes.VIEWS_REMOVE:
			return remove(state, action);
		default:
			return state;
	}
}
