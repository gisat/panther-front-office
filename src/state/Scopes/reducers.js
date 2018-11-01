import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/reducers';

const INITIAL_STATE = {
	data: [],
	activeKey: null
};

function setActiveKey(state, action){
	return {...state, activeKey: action.activeScopeKey};
}

export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.SCOPES_ADD:
			return common.add(state, action);
		case ActionTypes.SCOPES_SET_ACTIVE_KEY:
			return setActiveKey(state, action);
		default:
			return state;
	}
}
