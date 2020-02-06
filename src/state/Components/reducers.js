import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import Names from '../../constants/Names';

const INITIAL_STATE = {
};

function update(state, action) {
	return {...state, [action.component]: state[action.component] ? {...state[action.component], ...action.update} : action.update};
}
function set(state, action) {
	let path = action.path.split('.');
	if(path && path.length === 1 && path[0] === '') {
		return {...state, [action.component]: action.value};
	} else {
		return {...state, [action.component]: setHelper(state[action.component], path, action.value)};
	}
}

function setHelper(state, path, value) {
	let remainingPath = [...path];
	let currentKey = remainingPath.shift();
	if (remainingPath.length) {
		return {...state, [currentKey]: setHelper(state[currentKey], remainingPath, value)};
	} else {
		return {...state, [currentKey]: value};
	}
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.COMPONENTS.UPDATE:
			return update(state, action);
		case ActionTypes.COMPONENTS.SET:
			return set(state, action);
		default:
			return state;
	}
}
