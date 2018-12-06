import ActionTypes from '../../constants/ActionTypes';

import common from '../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.WMS_LAYERS.ADD:
			return common.add(state, action);
		default:
			return state;
	}
}
