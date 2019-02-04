import ActionTypes from '../../constants/ActionTypes';

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

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.SCREENS.ADD:
			return add(state, action);
		default:
			return state;
	}
};