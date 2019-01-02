import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.VISUALIZATIONS.ADD:
			return common.add(state, action);
		case ActionTypes.VISUALIZATIONS.ADD_UNRECEIVED:
			return common.addUnreceivedKeys(state, action);
		case ActionTypes.VISUALIZATIONS.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.VISUALIZATIONS.SET_ACTIVE_KEY:
			return common.setActive(state, action);
		case ActionTypes.VISUALIZATIONS.INITIALIZE_FOR_EXT:
			return common.initializeForExt(state, action);
		case ActionTypes.VISUALIZATIONS.USE.INDEXED.CLEAR:
			return common.useIndexedClear(state, action);
		case ActionTypes.VISUALIZATIONS.USE.INDEXED.REGISTER:
			return common.registerUseIndexed(state, action);
		case ActionTypes.VISUALIZATIONS.USE.KEYS.REGISTER:
			return common.useKeysRegister(state, action);
		case ActionTypes.VISUALIZATIONS.USE.KEYS.CLEAR:
			return common.useKeysClear(state, action);
		case ActionTypes.COMMON.DATA.SET_OUTDATED:
			return common.dataSetOutdated(state, action);
		case ActionTypes.COMMON.DATA.CLEANUP_ON_LOGOUT:
			return common.cleanupOnLogout(state, action);
		default:
			return state;
	}
}
