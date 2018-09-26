import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

import common from '../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.STYLES_ADD:
			return common.add(state, action);
		default:
			return state;
	}
}
