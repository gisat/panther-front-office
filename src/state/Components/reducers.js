import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	dataUploadOverlay: {
		open: false
	},
	windows: {
		// TODO windows z-order
		scenarios: {
			open: false,
			activeScreenKey: "caseList"
		},
		areas: null
	}
};

function update(state, action) {
	return {...state, [action.component]: state[action.component] ? {...state[action.component], ...action.update} : action.update};
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.COMPONENTS_UPDATE:
			return update(state, action);
		default:
			return state;
	}
}
