import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

import common from '../_common/reducers';

const INITIAL_STATE = {
	activeKey: null,
	byKey: null
};

const update = (state, data) => {
	return {...state, ...data};
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes._DEPRECATED_SELECTIONS.ADD:
			return common.add(state, action);
		case ActionTypes._DEPRECATED_SELECTIONS.REMOVE:
			return common.remove(state, action);
		case ActionTypes._DEPRECATED_SELECTIONS.SET_ACTIVE_KEY:
			return common.setActive(state, action);
		case ActionTypes._DEPRECATED_SELECTIONS.UPDATE_FROM_VIEW:
			return update(state, action.data);
		default:
			return state;
	}
};