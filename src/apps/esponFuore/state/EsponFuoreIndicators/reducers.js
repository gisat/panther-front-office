import ActionTypes from '../../constants/ActionTypes';
import {DEFAULT_INITIAL_STATE, commonReducers as common} from '@gisatcz/ptr-state';

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.ESPON_FUORE_INDICATORS.ADD:
			return common.add(state, action);
		case ActionTypes.ESPON_FUORE_INDICATORS.ADD_UNRECEIVED:
			return common.addUnreceivedKeys(state, action);
		case ActionTypes.ESPON_FUORE_INDICATORS.DELETE:
			return common.remove(state, action);
		case ActionTypes.ESPON_FUORE_INDICATORS.EDITED.REMOVE:
			return common.removeEdited(state, action);
		case ActionTypes.ESPON_FUORE_INDICATORS.EDITED.REMOVE_PROPERTY:
			return common.removeEditedProperty(state, action);
		case ActionTypes.ESPON_FUORE_INDICATORS.EDITED.UPDATE:
			return common.updateEdited(state, action);
		case ActionTypes.ESPON_FUORE_INDICATORS.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.ESPON_FUORE_INDICATORS.SET_ACTIVE_KEY:
			return common.setActive(state, action);
		case ActionTypes.ESPON_FUORE_INDICATORS.SET_ACTIVE_KEYS:
			return common.setActiveMultiple(state, action);
		case ActionTypes.ESPON_FUORE_INDICATORS.USE.KEYS.REGISTER:
			return common.useKeysRegister(state, action);
		case ActionTypes.ESPON_FUORE_INDICATORS.USE.KEYS.CLEAR:
			return common.useKeysClear(state, action);
		case ActionTypes.ESPON_FUORE_INDICATORS.USE.INDEXED.REGISTER:
			return common.registerUseIndexed(state, action);
		case ActionTypes.ESPON_FUORE_INDICATORS.USE.INDEXED.CLEAR:
			return common.useIndexedClear(state, action);
		case ActionTypes.ESPON_FUORE_INDICATORS.INDEX.CLEAR_ALL:
			return common.clearIndexes(state, action);
		case ActionTypes.ESPON_FUORE_INDICATORS.INDEX.CLEAR_INDEX:
			return common.clearIndex(state, action);
		case ActionTypes.ESPON_FUORE_INDICATORS.MARK_DELETED:
			return common.markDeleted(state, action);

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
