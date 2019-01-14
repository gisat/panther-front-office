import ActionTypes from '../../../constants/ActionTypes';
import common, {DEFAULT_INITIAL_STATE} from '../../_common/reducers';

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.AREAS.AREA_TREE_LEVELS.ADD:
			return common.add(state, action);
		case ActionTypes.AREAS.AREA_TREE_LEVELS.ADD_UNRECEIVED:
			return common.addUnreceivedKeys(state, action);
		case ActionTypes.AREAS.AREA_TREE_LEVELS.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.AREAS.AREA_TREE_LEVELS.SET_ACTIVE_KEY:
			return common.setActive(state, action);
		case ActionTypes.AREAS.AREA_TREE_LEVELS.USE.INDEXED.REGISTER:
			return common.registerUseIndexed(state, action);
		case ActionTypes.AREAS.AREA_TREE_LEVELS.USE.INDEXED.CLEAR:
			return common.useIndexedClear(state, action);
		case ActionTypes.AREAS.AREA_TREE_LEVELS.USE.KEYS.REGISTER:
			return common.useKeysRegister(state, action);
		case ActionTypes.AREAS.AREA_TREE_LEVELS.USE.KEYS.CLEAR:
			return common.useKeysClear(state, action);
		case ActionTypes.AREAS.AREA_TREE_LEVELS.INDEX.CLEAR_ALL:
			return common.clearIndexes(state, action);
		case ActionTypes.COMMON.DATA.SET_OUTDATED:
			return common.dataSetOutdated(state, action);
		case ActionTypes.COMMON.DATA.CLEANUP_ON_LOGOUT:
			return common.cleanupOnLogout(state, action);
		default:
			return state;
	}
}
