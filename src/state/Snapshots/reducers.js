import ActionTypes from '../../constants/ActionTypes';
import Action from '../Action';
import _ from 'lodash';

const INITIAL_STATE = {
	byKey: null
};

const add = (state, action) => {
	let newData = {...state.byKey};
	if (action.data && action.data.length) {
		action.data.forEach(model => {
			newData[model.key] = {...newData[model.key], ...model};
		});
	}
	return {...state, byKey: newData}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.SNAPSHOTS_ADD:
			return add(state, action);
		default:
			return state;
	}
};