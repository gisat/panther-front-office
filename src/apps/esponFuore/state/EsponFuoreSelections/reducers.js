import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../../../../state/_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../../../../state/_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.ESPON_FUORE_SELECTIONS.ADD:
			return common.add(state, action);
		case ActionTypes.ESPON_FUORE_SELECTIONS.REMOVE:
			return common.remove(state, action);
		case ActionTypes.ESPON_FUORE_SELECTIONS.SET_ACTIVE_KEY:
			return common.setActive(state, action);
		default:
			return state;
	}
}
