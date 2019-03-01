import _ from 'lodash';

import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.TOPICS.ADD:
			return common.add(state, action);
		case ActionTypes.TOPICS.ADD_UNRECEIVED:
			return common.addUnreceivedKeys(state, action);
		case ActionTypes.TOPICS.INITIALIZE_FOR_EXT:
			return common.initializeForExt(state, action);
		case ActionTypes.TOPICS.USE.KEYS.REGISTER:
			return common.useKeysRegister(state, action);
		case ActionTypes.TOPICS.USE.KEYS.CLEAR:
			return common.useKeysClear(state, action);
		default:
			return state;
	}
}
