import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	windows: {},
	sets: {},
};

// TODO order by z-index (in set)
// TODO add -> open, close -> remove ... animation ready

const INITIAL_WINDOW_DATA = {
	// TODO
};


export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.WINDOWS.ADD:
			// return add(state, action);
		case ActionTypes.WINDOWS.REMOVE:
			// return remove(state, action);
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