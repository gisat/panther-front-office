import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	key: null
};

/**
 * @param state
 * @param action
 * @param action.key {string}
 * @return {Object}
 */
const setKey = (state, action) => {
	return {
		...state, key: action.key
	};
};

const setBaseUrl = (state, action) => {
	return {
		...state, baseUrl: action.url
	};
};

const setLocalConfiguration = (state, action) => {
	return {
		...state, localConfiguration: action.localConfiguration
	};
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.APP.SET_BASE_URL:
			return setBaseUrl(state, action);
		case ActionTypes.APP.SET_KEY:
			return setKey(state, action);
		case ActionTypes.APP.SET_LOCAL_CONFIGURATION:
			return setLocalConfiguration(state, action);
		default:
			return state;
	}
}
