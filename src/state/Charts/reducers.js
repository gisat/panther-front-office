import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	charts: {},
	sets: {}
};

function update(state, action) {
	return {...state, ...action.data};
}


export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.CHARTS.UPDATE:
			return update(state, action);
		default:
			return state;
	}
}
