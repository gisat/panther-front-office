import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

const DEFAULT_ATTRIBUTE_COLLOR = '#008000';

const addAttribute = (state, action) => {
	if (action && action.data && action.data.length) {
		action.data.forEach(model => {
			//check attribute color
			//if no color, then use default
			if(!model.data.color) {
				model.data.color = DEFAULT_ATTRIBUTE_COLLOR;
			}
		});
	}

	return common.add(state, action);
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.ATTRIBUTES.ADD:
			return addAttribute(state, action);
		case ActionTypes.ATTRIBUTES.ADD_UNRECEIVED:
			return common.addUnreceivedKeys(state, action);
		case ActionTypes.ATTRIBUTES.DELETE:
			return common.remove(state, action);
		case ActionTypes.ATTRIBUTES.EDITED.REMOVE:
			return common.removeEdited(state, action);
		case ActionTypes.ATTRIBUTES.EDITED.REMOVE_PROPERTY:
			return common.removeEditedProperty(state, action);
		case ActionTypes.ATTRIBUTES.EDITED.UPDATE:
			return common.updateEdited(state, action);
		case ActionTypes.ATTRIBUTES.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.ATTRIBUTES.INDEX.CLEAR_ALL:
			return common.clearIndexes(state, action);
		case ActionTypes.ATTRIBUTES.INDEX.CLEAR_INDEX:
			return common.clearIndex(state, action);
		case ActionTypes.ATTRIBUTES.MARK_DELETED:
			return common.markDeleted(state, action);
		case ActionTypes.ATTRIBUTES.SET_ACTIVE_KEY:
			return common.setActive(state, action);
		case ActionTypes.ATTRIBUTES.USE.INDEXED.CLEAR:
			return common.useIndexedClear(state, action);
		case ActionTypes.ATTRIBUTES.USE.INDEXED.REGISTER:
			return common.registerUseIndexed(state, action);
		case ActionTypes.ATTRIBUTES.USE.KEYS.REGISTER:
			return common.useKeysRegister(state, action);
		case ActionTypes.ATTRIBUTES.USE.KEYS.CLEAR:
			return common.useKeysClear(state, action);

		case ActionTypes.COMMON.DATA.SET_OUTDATED:
			return common.dataSetOutdated(state, action);
		case ActionTypes.COMMON.DATA.CLEANUP_ON_LOGOUT:
			return common.cleanupOnLogout(state, action);
		case ActionTypes.COMMON.EDITED.REMOVE_PROPERTY_VALUES:
			return common.removeEditedPropertyValues(state, action);
		default:
			return state;
	}
}
