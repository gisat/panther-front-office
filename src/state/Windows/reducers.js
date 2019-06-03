import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	windows: {},
	sets: {},
};

const INITIAL_SET_STATE = {
	orderByHistory: []
};

const INITIAL_WINDOW_STATE = null; // opening/open/closing/closed

// TODO handle sizes in rem
const INITIAL_WINDOW_SETTINGS = {
	minWidth: 100,
	minHeight: 200,
	maxWidth: 500,
	maxHeight: 500,
	width: 200,
	height: 300,
	position: {
		top: 50,
		left: 50
	}
};

const add = (state, action) => {
	let windows = {...state.windows};

	windows[action.windowKey] = {
		key: action.windowKey,
		data: {
			state: action.state ? action.state : INITIAL_WINDOW_STATE,
			settings: {...INITIAL_WINDOW_SETTINGS, ...action.settings},
			component: action.component,
			props: action.props,
		}
	};

	let sets = {...state.sets};
	sets[action.setKey] = {...INITIAL_SET_STATE, ...sets[action.setKey]};
	sets[action.setKey].orderByHistory = [...sets[action.setKey].orderByHistory, action.windowKey];

	return {...state, windows, sets};
};

const open = (state, action) => {
	let windows = {...state.windows};

	windows[action.windowKey] = {
		key: action.windowKey,
		data: {...windows[action.windowKey].data, state: 'open'}
	};

	let sets = {...state.sets};
	sets[action.setKey] = {...INITIAL_SET_STATE, ...sets[action.setKey]};
	sets[action.setKey].orderByHistory = [...sets[action.setKey].orderByHistory, action.windowKey];

	return {...state, windows, sets};
};

const remove = (state, action) => {
	let sets = {...state.sets};
	if(_.isEmpty(sets) || _.isEmpty(sets[action.setKey]) || !action.windowKey) {
		return state;
	}
	let orderByHistory = _.without([...sets[action.setKey].orderByHistory], action.windowKey);

	let windows = {...state.windows};
	if (windows[action.windowKey]) {
		windows[action.windowKey] = {
			key: action.windowKey,
			data: {...windows[action.windowKey].data, state: 'close'}
		};
	}

	return {...state, windows, sets: {...sets, [action.setKey]: {orderByHistory}}};
};

const top = (state, action) => {
	let sets = {...state.sets};
	let orderByHistory = _.without([...sets[action.setKey].orderByHistory], action.windowKey);
	orderByHistory.push(action.windowKey);

	return {
		...state,
		sets: {
			...sets,
			[action.setKey]: {
				...sets[action.setKey],
				orderByHistory
			}
		}
	};
};


const update = (state, action) => {
	let windows = {...state.windows};
	windows[action.windowKey] = {
		key: action.windowKey,
		data: {...windows[action.windowKey].data, ...action.data}
	};

	return {...state, windows};
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.WINDOWS.ADD:
			return add(state, action);
		case ActionTypes.WINDOWS.OPEN:
			return open(state, action);
		case ActionTypes.WINDOWS.REMOVE:
			return remove(state, action);
		case ActionTypes.WINDOWS.SETS.ADD:
			// return addSet(state, action);
		case ActionTypes.WINDOWS.TOP:
			return top(state, action);
		case ActionTypes.WINDOWS.UPDATE:
			return update(state, action);
		default:
			return state;
	}
};