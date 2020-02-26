import ActionTypes from '../../constants/ActionTypes';

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
	let path = action.path.split('.');
	return {...state, localConfiguration: setHelper(state.localConfiguration, path, action.value)};
};

const updateLocalConfiguration = (state, action) => {
	return {...state, localConfiguration: state.localConfiguration ? {...state.localConfiguration, ...action.update} : action.update};
};

function setHelper(state, path, value) {
	let remainingPath = [...path];
	let currentKey = remainingPath.shift();
	if (remainingPath.length) {
		return {...state, [currentKey]: setHelper(state[currentKey], remainingPath, value)};
	} else {
		return {...state, [currentKey]: value};
	}
}

const receiveConfiguration = (state, action) => {
	return {...state, configuration: action.configuration};
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.APP.SET_BASE_URL:
			return setBaseUrl(state, action);
		case ActionTypes.APP.SET_KEY:
			return setKey(state, action);
		case ActionTypes.APP.SET_LOCAL_CONFIGURATION:
			return setLocalConfiguration(state, action);
		case ActionTypes.APP.UPDATE_LOCAL_CONFIGURATION:
			return updateLocalConfiguration(state, action);
		case ActionTypes.APP.RECEIVE_CONFIGURATION:
			return receiveConfiguration(state, action);
		default:
			return state;
	}
}
