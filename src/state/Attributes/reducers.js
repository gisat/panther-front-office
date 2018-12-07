import _ from 'lodash';

import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.ATTRIBUTES.ADD:
			return common.add(state, action);
		case ActionTypes.ATTRIBUTES.INITIALIZE_FOR_EXT:
			return common.initializeForExt(state, action);
		case ActionTypes.ATTRIBUTES.USE.KEYS.REGISTER:
			return common.useKeysRegister(state, action);
		case ActionTypes.ATTRIBUTES.USE.KEYS.CLEAR:
			return common.useKeysClear(state, action);
		default:
			return state;
	}
}
