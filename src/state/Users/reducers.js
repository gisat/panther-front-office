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
		case ActionTypes.USERS.ADD_UNRECEIVED:
			return common.addUnreceivedKeys(state, action);
		case ActionTypes.USERS.SET_ACTIVE_KEY:
			return common.setActive(state, action);
		case ActionTypes.USERS.GROUPS.ADD:
			return {...state, groups: common.add(state.groups, action)}
		case ActionTypes.USERS.GROUPS.ADD_UNRECEIVED:
			return {...state, groups: common.addUnreceivedKeys(state.groups, action)}
		case ActionTypes.USERS_LOAD_REQUEST:
			return loadRequest(state, action);
		case ActionTypes.USERS_LOAD_REQUEST_ERROR:
			return loadRequestError(state, action);
		case ActionTypes.USERS_UPDATE:
			return update(state, action);
		default:
			return state;
	}
}
