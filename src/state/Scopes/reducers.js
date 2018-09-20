import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common, {DEFAULT_INITIAL_STATE} from '../_common/reducers';

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE,
	data: []
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.SCOPES_ADD:
			return common.add(state, action);
		case ActionTypes.SCOPES_SET_ACTIVE_KEY:
			return common.setActive(state, action);
		default:
			return state;
	}
}
