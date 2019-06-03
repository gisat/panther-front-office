import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

import common from '../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE,
	groups: {...DEFAULT_INITIAL_STATE}
};

function update(state, action) {
	let {userId, ...data} = action.data;
	data.activeKey = action.data.userId;

	return {...state, ...data};
}

function loadRequest(state, action) {
	return {...state, loading: true};
}
function loadRequestError(state, action) {
	return {...state, loading: false};
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.USERS.ADD:
			return common.add(state, action);
		case ActionTypes.USERS.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.USERS.INDEX.CLEAR_ALL:
			return common.clearIndexes(state, action);
		case ActionTypes.USERS.USE.INDEXED.CLEAR:
			return common.useIndexedClear(state, action);
		case ActionTypes.USERS.USE.INDEXED.REGISTER:
			return common.registerUseIndexed(state, action);
		case ActionTypes.USERS.ADD_UNRECEIVED:
			return common.addUnreceivedKeys(state, action);
		case ActionTypes.USERS.SET_ACTIVE_KEY:
			return common.setActive(state, action);
		case ActionTypes.USERS.USE.KEYS.CLEAR:
			return common.useKeysClear(state, action);
		case ActionTypes.USERS.USE.KEYS.REGISTER:
			return common.useKeysRegister(state, action);
		case ActionTypes.COMMON.DATA.SET_OUTDATED:
			//set outdated for users and users.groups
			return {...common.dataSetOutdated(state, action), groups: common.dataSetOutdated(state.groups, action)};
		case ActionTypes.COMMON.DATA.CLEANUP_ON_LOGOUT:
			//clear users and users.groups
			return {...common.cleanupOnLogout(state, action), groups: common.cleanupOnLogout(state.groups, action)};
		case ActionTypes.USERS_LOAD_REQUEST:
			return loadRequest(state, action);
		case ActionTypes.USERS_LOAD_REQUEST_ERROR:
			return loadRequestError(state, action);
		case ActionTypes.USERS_UPDATE:
			return update(state, action);
		case ActionTypes.USERS.GROUPS.ADD:
			return {...state, groups: common.add(state.groups, action)};
		case ActionTypes.USERS.GROUPS.INDEX.ADD:
			return {...state, groups: common.addIndex(state.groups, action)};
		case ActionTypes.USERS.GROUPS.INDEX.CLEAR_ALL:
			return {...state, groups: common.clearIndexes(state.groups, action)};
		case ActionTypes.USERS.GROUPS.ADD_UNRECEIVED:
			return {...state, groups: common.addUnreceivedKeys(state.groups, action)};
		case ActionTypes.USERS.GROUPS.USE.INDEXED.CLEAR:
			return {...state, groups: common.useIndexedClear(state.groups, action)};
		case ActionTypes.USERS.GROUPS.USE.KEYS.CLEAR:
			return {...state, groups: common.useKeysClear(state.groups, action)};
		case ActionTypes.USERS.GROUPS.USE.INDEXED.REGISTER:
			return {...state, groups: common.registerUseIndexed(state.groups, action)};
		default:
			return state;
	}
}
