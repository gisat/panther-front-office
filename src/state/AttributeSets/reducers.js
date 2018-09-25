import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE,
	activeKeys: null
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.ATTRIBUTE_SETS_ADD:
			return common.add(state, action);
		case ActionTypes.ATTRIBUTE_SETS_SET_ACTIVE_MULTI:
			return common.setActiveMultiple(state, action);
		default:
			return state;
	}
}
