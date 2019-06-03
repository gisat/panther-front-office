import ActionTypes from '../../../constants/ActionTypes';
import _ from 'lodash';
import common from '../../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.SCENARIOS_CASES_ADD:
			return common.add(state, action);
		case ActionTypes.SCENARIOS_CASES_SET_ACTIVE:
			return common.setActive(state, action);
		case ActionTypes.SCENARIOS_CASES_EDITED_UPDATE:
			return common.updateEdited(state, action);
		case ActionTypes.SCENARIOS_CASES_EDITED_REMOVE:
			return common.removeEdited(state, action);
		case ActionTypes.SCENARIOS_CASES_EDITED_REMOVE_ACTIVE:
			return common.removeEditedActive(state, action);
		case ActionTypes.SCENARIOS_CASES_EDITED_REMOVE_PROPERTY:
			return common.removeEditedProperty(state, action);
		case ActionTypes.SCENARIOS_CASES_RECEIVE:
			return common.add(state, action);
		case ActionTypes.SCENARIOS_CASES_REMOVE:
			return common.remove(state, action);
		case ActionTypes.SCENARIOS_CASES_UPDATE:
			return common.add(state, action);
		default:
			return state;
	}
}