import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
    screens: {},
    sets: {},
};

const INITIAL_SET_STATE = {
    orderByHistory: [],
    orderBySpace: [],
};

const INITIAL_SCREEN_DATA = {
    width: null,
    minActiveWidth: null,
    desiredState: 'open', //open/retracted/closing
};

const add = (state, action) => {
	let screens = {...state.screens};

	screens[action.lineage] = {
		lineage: action.lineage,
		data: {...INITIAL_SCREEN_DATA, ...action.data}
	};

	let sets = {...state.sets};
	sets[action.setKey] = {...INITIAL_SET_STATE, ...sets[action.setKey]};
	sets[action.setKey].orderBySpace = [...sets[action.setKey].orderBySpace, action.lineage];
	sets[action.setKey].orderByHistory = [...sets[action.setKey].orderByHistory, action.lineage];

	return {...state, screens, sets};
};

const addSet = (state, action) => {
	let sets = {...state.sets};
	sets[action.setKey] = {...INITIAL_SET_STATE};
	return {...state, sets};
};

const close = (state, action) => {
	let screens = {...state.screens};

	screens[action.lineage] = {
		lineage: action.lineage,
		data: {...screens[action.lineage].data, desiredState: 'closing'}
	};

	return {...state, screens};
};

const open = (state, action) => {
	let screens = {...state.screens};

	screens[action.lineage] = {
		lineage: action.lineage,
		data: {...screens[action.lineage].data, desiredState: 'open'}
	};

	return {...state, screens};
};

const remove = (state, action) => {
	let sets = {...state.sets};
	let orderByHistory = _.without([...sets[action.setKey].orderByHistory], action.lineage);
	let orderBySpace = _.without([...sets[action.setKey].orderBySpace], action.lineage);

	return {...state, sets: {...sets, [action.setKey]: {orderByHistory, orderBySpace}}};
};

const removeAllScreensFromSet = (state, action) => {
	let sets = {...state.sets};
	return {...state, sets: {...sets, [action.setKey]: {orderByHistory: [], orderBySpace: []}}};
};

const retract = (state, action) => {
	let screens = {...state.screens};

	screens[action.lineage] = {
		lineage: action.lineage,
		data: {...screens[action.lineage].data, desiredState: 'retracted'}
	};

	return {...state, screens};
};

const topHistory = (state, action) => {
	let sets = {...state.sets};
	let orderByHistory = _.without([...sets[action.setKey].orderByHistory], action.lineage);
	orderByHistory.push(action.lineage);

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

// TODO test properly!
const update = (state, action) => {
	let screens = {...state.screens};

	screens[action.lineage] = {
		...screens[action.lineage],
		data: {...screens[action.lineage].data, ...action.data}
	};

	let sets = {...state.sets};
	sets[action.setKey] = {...INITIAL_SET_STATE, ...sets[action.setKey]};

	let orderByHistory = _.without(sets[action.setKey].orderByHistory, action.lineage);
	orderByHistory.push(action.lineage);
	sets[action.setKey].orderByHistory = orderByHistory;

	let alreadyInOrder = _.find(sets[action.setKey].orderBySpace, (lineage) => lineage === action.lineage);
	if (!alreadyInOrder) {
		let orderBySpace = _.without(sets[action.setKey].orderBySpace, action.lineage);
		orderBySpace.push(action.lineage);
		sets[action.setKey].orderBySpace = orderBySpace;
	}

	return {...state, screens, sets};
};


export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.SCREENS.ADD:
			return add(state, action);
		case ActionTypes.SCREENS.CLOSE:
			return close(state, action);
		case ActionTypes.SCREENS.OPEN:
			return open(state, action);
		case ActionTypes.SCREENS.REMOVE:
			return remove(state, action);
		case ActionTypes.SCREENS.REMOVE_ALL:
			return removeAllScreensFromSet(state, action);
		case ActionTypes.SCREENS.RETRACT:
			return retract(state, action);
		case ActionTypes.SCREENS.SETS.ADD:
			return addSet(state, action);
		case ActionTypes.SCREENS.TOP_HISTORY:
			return topHistory(state, action);
		case ActionTypes.SCREENS.UPDATE:
			return update(state, action);
		default:
			return state;
	}
};