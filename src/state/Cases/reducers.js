import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.CASES.ADD:
			return common.add(state, action);
		case ActionTypes.CASES.ADD_UNRECEIVED:
			return common.addUnreceivedKeys(state, action);
		case ActionTypes.CASES.DELETE:
			return common.remove(state, action);
		case ActionTypes.CASES.EDITED.REMOVE:
			return common.removeEdited(state, action);
		case ActionTypes.CASES.EDITED.REMOVE_PROPERTY:
			return common.removeEditedProperty(state, action);
		case ActionTypes.CASES.EDITED.UPDATE:
			return common.updateEdited(state, action);
		case ActionTypes.CASES.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.CASES.INDEX.CLEAR_ALL:
			return common.clearIndexes(state, action);
		case ActionTypes.CASES.INDEX.CLEAR_INDEX:
			return common.clearIndex(state, action);
		case ActionTypes.CASES.MARK_DELETED:
			return common.markDeleted(state, action);
		case ActionTypes.CASES.SET_ACTIVE_KEY:
			return common.setActive(state, action);
		case ActionTypes.CASES.SET_ACTIVE_KEYS:
			return common.setActiveMultiple(state, action);
		case ActionTypes.CASES.USE.INDEXED.CLEAR:
			return common.useIndexedClear(state, action);
		case ActionTypes.CASES.USE.INDEXED.REGISTER:
			return common.registerUseIndexed(state, action);
		case ActionTypes.CASES.USE.KEYS.REGISTER:
			return common.useKeysRegister(state, action);
		case ActionTypes.CASES.USE.KEYS.CLEAR:
			return common.useKeysClear(state, action);
		case ActionTypes.COMMON.DATA.SET_OUTDATED:
			return common.dataSetOutdated(state, action);
		case ActionTypes.COMMON.DATA.CLEANUP_ON_LOGOUT:
			return common.cleanupOnLogout(state, action);
		default:
			return state;
	}
}
