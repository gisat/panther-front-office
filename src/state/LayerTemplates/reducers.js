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
		case ActionTypes.LAYER_TEMPLATES.DELETE:
			return common.remove(state, action);
		case ActionTypes.LAYER_TEMPLATES.EDITED.REMOVE:
			return common.removeEdited(state, action);
		case ActionTypes.LAYER_TEMPLATES.EDITED.REMOVE_PROPERTY:
			return common.removeEditedProperty(state, action);
		case ActionTypes.LAYER_TEMPLATES.EDITED.UPDATE:
			return common.updateEdited(state, action);
		case ActionTypes.LAYER_TEMPLATES.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.LAYER_TEMPLATES.INDEX.CLEAR_ALL:
			return common.clearIndexes(state, action);
		case ActionTypes.LAYER_TEMPLATES.INDEX.CLEAR_INDEX:
			return common.clearIndex(state, action);
		case ActionTypes.LAYER_TEMPLATES.MARK_DELETED:
			return common.markDeleted(state, action);
		case ActionTypes.LAYER_TEMPLATES.SET_ACTIVE_KEY:
			return common.setActive(state, action);
		case ActionTypes.LAYER_TEMPLATES.SET_ACTIVE_KEYS:
			return common.setActiveMultiple(state, action);
		case ActionTypes.LAYER_TEMPLATES.USE.KEYS.REGISTER:
			return common.useKeysRegister(state, action);
		case ActionTypes.LAYER_TEMPLATES.USE.KEYS.CLEAR:
			return common.useKeysClear(state, action);
		case ActionTypes.LAYER_TEMPLATES.USE.INDEXED.REGISTER:
			return common.registerUseIndexed(state, action);
		case ActionTypes.LAYER_TEMPLATES.USE.INDEXED.CLEAR:
			return common.useIndexedClear(state, action);

		case ActionTypes.COMMON.DATA.SET_OUTDATED:
			return common.dataSetOutdated(state, action);
		case ActionTypes.COMMON.DATA.CLEANUP_ON_LOGOUT:
			return common.cleanupOnLogout(state, action);
		default:
			return state;
	}
}
