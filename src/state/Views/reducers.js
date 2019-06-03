import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common, {DEFAULT_INITIAL_STATE} from '../_common/reducers';

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.VIEWS.ADD:
			return common.add(state, action);
		case ActionTypes.VIEWS.ADD_UNRECEIVED:
			return common.addUnreceivedKeys(state, action);
		case ActionTypes.VIEWS.DELETE:
			return common.remove(state, action);
		case ActionTypes.VIEWS.EDITED.REMOVE:
			return common.removeEdited(state, action);
		case ActionTypes.VIEWS.EDITED.REMOVE_PROPERTY:
			return common.removeEditedProperty(state, action);
		case ActionTypes.VIEWS.EDITED.UPDATE:
			return common.updateEdited(state, action);
		case ActionTypes.VIEWS.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.VIEWS.SET_ACTIVE_KEY:
			return common.setActive(state, action);
		case ActionTypes.VIEWS.SET_ACTIVE_KEYS:
			return common.setActiveMultiple(state, action);
		case ActionTypes.VIEWS.USE.KEYS.REGISTER:
			return common.useKeysRegister(state, action);
		case ActionTypes.VIEWS.USE.KEYS.CLEAR:
			return common.useKeysClear(state, action);
		case ActionTypes.VIEWS.USE.INDEXED.REGISTER:
			return common.registerUseIndexed(state, action);
		case ActionTypes.VIEWS.USE.INDEXED.CLEAR:
			return common.useIndexedClear(state, action);
		case ActionTypes.VIEWS.INDEX.CLEAR_ALL:
			return common.clearIndexes(state, action);
		case ActionTypes.VIEWS.INDEX.CLEAR_INDEX:
			return common.clearIndex(state, action);
		case ActionTypes.VIEWS.MARK_DELETED:
			return common.markDeleted(state, action);
		case ActionTypes.COMMON.DATA.SET_OUTDATED:
			return common.dataSetOutdated(state, action);
		case ActionTypes.COMMON.DATA.CLEANUP_ON_LOGOUT:
			return common.cleanupOnLogout(state, action);
		default:
			return state;
	}
}
