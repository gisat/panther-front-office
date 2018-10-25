import ActionTypes from '../../constants/ActionTypes';
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

const remove = (state, action) => {
	let newData = state.byKey ? _.omit(state.byKey, action.keys) : null;
	return {...state, byKey: newData}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.SNAPSHOTS_ADD:
			return add(state, action);
		case ActionTypes.SNAPSHOTS_REMOVE:
			return remove(state, action);
		default:
			return state;
	}
};