import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common, {DEFAULT_INITIAL_STATE} from '../_common/reducers';

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.SCOPES.ADD:
			return common.add(state, action);
		case ActionTypes.SCOPES.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.SCOPES.SET_ACTIVE_KEY:
			return common.setActive(state, action);
		case ActionTypes.SCOPES.USE.INDEXED.REGISTER:
			return common.registerUseIndexed(state, action);
		case ActionTypes.SCOPES.USE.INDEXED.CLEAR:
			return common.useIndexedClear(state, action);
		case ActionTypes.SCOPES.INDEX.CLEAR_ALL:
			return common.clearIndexes(state, action);
		default:
			return state;
	}
}
