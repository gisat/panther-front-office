import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE,
	activeKeys: null
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.PLACES.ADD:
			return common.add(state, action);
		case ActionTypes.PLACES.ADD_UNRECEIVED:
			return common.addUnreceivedKeys(state, action);
		case ActionTypes.PLACES.DELETE:
			return common.remove(state, action);
		case ActionTypes.PLACES.EDITED.REMOVE:
			return common.removeEdited(state, action);
		case ActionTypes.PLACES.EDITED.REMOVE_PROPERTY:
			return common.removeEditedProperty(state, action);
		case ActionTypes.PLACES.EDITED.UPDATE:
			return common.updateEdited(state, action);
		case ActionTypes.PLACES.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.PLACES.INDEX.CLEAR_ALL:
			return common.clearIndexes(state, action);
		case ActionTypes.PLACES.INDEX.CLEAR_INDEX:
			return common.clearIndex(state, action);
		case ActionTypes.PLACES.MARK_DELETED:
			return common.markDeleted(state, action);
		case ActionTypes.PLACES.SET_ACTIVE_KEY:
			return common.setActive(state, action);
		case ActionTypes.PLACES_SET_ACTIVE_MULTI:
			return common.setActiveMultiple(state, action);
		case ActionTypes.PLACES.USE.INDEXED.CLEAR:
			return common.useIndexedClear(state, action);
		case ActionTypes.PLACES.USE.INDEXED.REGISTER:
			return common.registerUseIndexed(state, action);
		case ActionTypes.PLACES.USE.KEYS.REGISTER:
			return common.useKeysRegister(state, action);
		case ActionTypes.PLACES.USE.KEYS.CLEAR:
			return common.useKeysClear(state, action);

		case ActionTypes.COMMON.DATA.SET_OUTDATED:
			return common.dataSetOutdated(state, action);
		case ActionTypes.COMMON.DATA.CLEANUP_ON_LOGOUT:
			return common.cleanupOnLogout(state, action);
		default:
			return state;
	}
}
