import ActionTypes from '../../constants/ActionTypes';

// ============ creators ===========

// ============ actions ===========
const actionSetKey = (key) => {
	return {
		type: ActionTypes.APP.SET_KEY,
		key
	}
};
const actionSetBaseUrl = (url) => {
	return {
		type: ActionTypes.APP.SET_BASE_URL,
		url
	}
};
const actionSetConfiguration = (configuration) => {
	return {
		type: ActionTypes.APP.SET_CONFIGURATION,
		configuration
	}
};

// ============ export ===========

export default {
	setKey: actionSetKey,
	setBaseUrl: actionSetBaseUrl,
	setConfiguration: actionSetConfiguration,
}
