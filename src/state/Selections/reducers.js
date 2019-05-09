import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

import common from '../_common/reducers';

const INITIAL_STATE = {
	activeKey: null,
	byKey: null
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.SELECTIONS.ADD:
			return common.add(state, action);
		case ActionTypes.SELECTIONS.REMOVE:
			return common.remove(state, action);
		case ActionTypes.SELECTIONS.SET_ACTIVE_KEY:
			return common.setActive(state, action);
		default:
			return state;
	}
};