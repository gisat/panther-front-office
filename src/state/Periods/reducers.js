import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	activeKey: null,
	data: null,
	loading: false
};


function setActive(state, action) {
	return {...state, activeKey: action.key};
}

function add(state, action) {
	return {...state, data: (state.data ? [...state.data, ...action.data] : action.data)};
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.PERIODS_ADD:
			return add(state, action);
		case ActionTypes.PERIODS_SET_ACTIVE:
			return setActive(state, action);
		default:
			return state;
	}
}
