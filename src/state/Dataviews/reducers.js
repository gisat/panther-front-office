import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.DATAVIEWS.ADD:
			return common.add(state, action);
		case ActionTypes.DATAVIEWS.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.DATAVIEWS_REMOVE:
			return common.remove(state, action);
		case ActionTypes.DATAVIEWS.SET_ACTIVE_KEY:
			return common.setActive(state, action);
		default:
			return state;
	}
}
