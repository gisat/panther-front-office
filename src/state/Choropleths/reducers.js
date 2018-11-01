import ActionTypes from '../../constants/ActionTypes';
import Action from '../Action';
import _ from 'lodash';

const INITIAL_STATE = {
	activeKeys: null,
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

const setActiveMultiple = (state, action) => {
	return {...state, activeKeys: action.keys};
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.CHOROPLETHS_UPDATE:
			return add(state, action);
		case ActionTypes.CHOROPLETHS_SET_ACTIVE_KEYS:
			return setActiveMultiple(state, action);
		default:
			return state;
	}
};