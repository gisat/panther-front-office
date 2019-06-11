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
const actionSetLocalConfiguration = (localConfiguration) => {
	return {
		type: ActionTypes.APP.SET_LOCAL_CONFIGURATION,
		localConfiguration
	}
};

// ============ export ===========

export default {
	setKey: actionSetKey,
	setBaseUrl: actionSetBaseUrl,
	setLocalConfiguration: actionSetLocalConfiguration,
}
