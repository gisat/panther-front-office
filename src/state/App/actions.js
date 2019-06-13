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
const actionSetLocalConfiguration = (path, value) => {
	return {
		type: ActionTypes.APP.SET_LOCAL_CONFIGURATION,
		path,
		value
	}
};

// ============ export ===========

export default {
	setKey: actionSetKey,
	setBaseUrl: actionSetBaseUrl,
	setLocalConfiguration: actionSetLocalConfiguration,
}
