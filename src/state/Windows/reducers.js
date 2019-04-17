import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	windows: {},
	sets: {},
};

const INITIAL_SET_STATE = {
	orderByHistory: []
};

const INITIAL_WINDOW_DATA = {
	state: null, // opening/open/closing/closed
	width: 10, // rem
	height: 10, // rem
	top: 5, // rem
	left: 5, // rem
	bottom: "auto",
	right: "auto"
};

const add = (state, action) => {
	let windows = {...state.windows};

	windows[action.windowKey] = {
		key: action.windowKey,
		data: {...INITIAL_WINDOW_DATA, ...action.data}
	};

	let sets = {...state.sets};
	sets[action.setKey] = {...INITIAL_SET_STATE, ...sets[action.setKey]};
	sets[action.setKey].orderByHistory = [...sets[action.setKey].orderByHistory, action.windowKey];

	return {...state, windows, sets};
};

const remove = (state, action) => {
	let sets = {...state.sets};
	let orderByHistory = _.without([...sets[action.setKey].orderByHistory], action.windowKey);

	let windows = {...state.windows};
	windows[action.windowKey] = {
		key: action.windowKey,
		data: {...windows[action.windowKey].data, state: 'close'}
	};

	return {...state, windows, sets: {...sets, [action.setKey]: {orderByHistory}}};
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.WINDOWS.ADD:
			return add(state, action);
		case ActionTypes.WINDOWS.REMOVE:
			return remove(state, action);
		case ActionTypes.WINDOWS.SETS.ADD:
			// return addSet(state, action);
		case ActionTypes.WINDOWS.TOP:
			// return topHistory(state, action);
		case ActionTypes.WINDOWS.UPDATE:
			// return update(state, action);
		default:
			return state;
	}
};