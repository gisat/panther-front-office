import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE,
	activeKeys: null,
	initializedForExt: false // TODO It will be removed along with Ext
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.ATTRIBUTE_SETS.ADD:
			return common.add(state, action);
		case ActionTypes.ATTRIBUTE_SETS.SET_ACTIVE_KEYS:
			return common.setActiveMultiple(state, action);
		case ActionTypes.ATTRIBUTE_SETS.INITIALIZE_FOR_EXT:
			return common.initializeForExt(state, action);
		default:
			return state;
	}
}
