import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE,
	activeKeys: null
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.PLACES_ADD:
			return common.add(state, action);
		case ActionTypes.PLACES.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.PLACES_SET_ACTIVE:
			return common.setActive(state, action);
		case ActionTypes.PLACES_SET_ACTIVE_MULTI:
			return common.setActiveMultiple(state, action);
		case ActionTypes.PLACES.INITIALIZE_FOR_EXT:
			return common.initializeForExt(state, action);
		case ActionTypes.PLACES.USE.INDEXED.REGISTER:
			return common.registerUseIndexed(state, action);
		default:
			return state;
	}
}
