import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import Names from '../../constants/Names';

const INITIAL_STATE = {
};

function update(state, action) {
	return {...state, [action.component]: state[action.component] ? {...state[action.component], ...action.update} : action.update};
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.COMPONENTS.UPDATE:
			return update(state, action);
		default:
			return state;
	}
}
