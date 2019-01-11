import ActionTypes from '../../../constants/ActionTypes';
import _ from 'lodash';
import common from '../../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE,
	activeKeys: null,
	defaultSituationActive: true
};

const request = (state) => {
	return {...state, loading: true};
};

const requestError = (state) => {
	return {...state, loading: false};
};

const setDefaultSituationActive = (state, action) => {
	return {...state, defaultSituationActive: action.active};
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.SCENARIOS.ADD:
			return common.add(state, action);
		case ActionTypes.SCENARIOS.ADD_UNRECEIVED:
			return common.addUnreceivedKeys(state, action);
		case ActionTypes.SCENARIOS_EDITED_UPDATE:
			return common.updateEdited(state, action);
		case ActionTypes.SCENARIOS_EDITED_REMOVE:
			return common.removeEdited(state, action);
		case ActionTypes.SCENARIOS_EDITED_REMOVE_PROPERTY:
			return common.removeEditedProperty(state, action);
		case ActionTypes.SCENARIOS_RECEIVE:
			return common.add(state, action);
		case ActionTypes.SCENARIOS_REQUEST:
			return request(state, action);
		case ActionTypes.SCENARIOS_REQUEST_ERROR:
			return requestError(state, action);
		case ActionTypes.SCENARIOS_SET_ACTIVE:
			return common.setActive(state, action);
		case ActionTypes.SCENARIOS_SET_ACTIVE_MULTI:
			return common.setActiveMultiple(state, action);
		case ActionTypes.SCENARIOS_SET_DEFAULT_SITUATION_ACTIVE:
			return setDefaultSituationActive(state, action);

		case ActionTypes.SCENARIOS_API_PROCESSING_FILE_ERROR:
			return common.add(state, action);
		case ActionTypes.SCENARIOS_API_PROCESSING_FILE_STARTED:
			return common.add(state, action);
		case ActionTypes.SCENARIOS_API_PROCESSING_FILE_SUCCESS:
			return common.add(state, action);
		default:
			return state;
	}
}