import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.THEMES.ADD:
			return common.add(state, action);
		case ActionTypes.THEMES.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.THEMES.SET_ACTIVE_KEY:
			return common.setActive(state, action);
		case ActionTypes.THEMES.USE.INDEXED.REGISTER:
			return common.registerUseIndexed(state, action);
		default:
			return state;
	}
}
