import ActionTypes from '../../constants/ActionTypes';

const INITIAL_STATE = {
    screens: {},
    sets: {},
};

const INITIAL_SET_STATE = {
    orderByHistory: [],
    orderBySpace: [],
};

const INITIAL_SCREEN_STATE = {
    lineage: null, //scope-place
    width: null,
    minActiveWidth: null,
    state: 'open', //open/retracted/closing
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		// case ActionTypes.SNAPSHOTS_ADD:
		// 	return add(state, action);
		default:
			return state;
	}
};