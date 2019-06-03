import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.SPATIAL_RELATIONS.ADD:
			return common.add(state, action);
		case ActionTypes.SPATIAL_RELATIONS.ADD_UNRECEIVED:
			return common.addUnreceivedKeys(state, action);
		case ActionTypes.SPATIAL_RELATIONS.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.SPATIAL_RELATIONS.USE.INDEXED.REGISTER:
			return common.registerUseIndexed(state, action);
		case ActionTypes.SPATIAL_RELATIONS.USE.INDEXED.CLEAR:
			return common.useIndexedClear(state, action);
		default:
			return state;
	}
}
