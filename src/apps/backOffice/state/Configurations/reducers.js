import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../../../../state/_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../../../../state/_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

function setManaged(state, action) {
	return {
		...state,
		activeKey: action.key
	};
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.CONFIGURATIONS.ADD:
			return common.add(state, action);
		case ActionTypes.CONFIGURATIONS.ADD_UNRECEIVED:
			return common.addUnreceivedKeys(state, action);
		case ActionTypes.CONFIGURATIONS.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.CONFIGURATIONS.SET_ACTIVE_KEY:
			return common.setActive(state, action);
		case ActionTypes.CONFIGURATIONS.SET_ACTIVE_KEYS:
			return common.setActiveMultiple(state, action);
		case ActionTypes.CONFIGURATIONS.SET_MANAGED:
			return setManaged(state, action);
		case ActionTypes.CONFIGURATIONS.USE.INDEXED.CLEAR:
			return common.useIndexedClear(state, action);
		case ActionTypes.CONFIGURATIONS.USE.INDEXED.REGISTER:
			return common.registerUseIndexed(state, action);
		case ActionTypes.CONFIGURATIONS.USE.KEYS.REGISTER:
			return common.useKeysRegister(state, action);
		case ActionTypes.CONFIGURATIONS.USE.KEYS.CLEAR:
			return common.useKeysClear(state, action);
		case ActionTypes.COMMON.DATA.SET_OUTDATED:
			return common.dataSetOutdated(state, action);
		case ActionTypes.COMMON.DATA.CLEANUP_ON_LOGOUT:
			return common.cleanupOnLogout(state, action);
		default:
			return state;
	}
}
