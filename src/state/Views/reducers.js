import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	data: null
};

function addDistinct(state, action) {
	return {...state, data: (state.data ? [...state.data, ...action.data] : action.data)};
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.VIEWS_ADD:
			return addDistinct(state, action);
		default:
			return state;
	}
}
