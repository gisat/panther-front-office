import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

import common from '../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.LAYER_TEMPLATES.ADD:
			return common.add(state, action);
		case ActionTypes.LAYER_TEMPLATES.ADD_UNRECEIVED:
			return common.addUnreceivedKeys(state, action);
		case ActionTypes.LAYER_TEMPLATES.USE.KEYS.REGISTER:
			return common.useKeysRegister(state, action);
		case ActionTypes.LAYER_TEMPLATES.USE.KEYS.CLEAR:
			return common.useKeysClear(state, action);
		case ActionTypes.COMMON.DATA.SET_OUTDATED:
			return common.dataSetOutdated(state, action);
		case ActionTypes.COMMON.DATA.CLEANUP_ON_LOGOUT:
			return common.cleanupOnLogout(state, action);
		default:
			return state;
	}
}
