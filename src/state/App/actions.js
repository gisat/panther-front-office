import ActionTypes from '../../constants/ActionTypes';

// ============ creators ===========

// ============ actions ===========
const actionSetKey = (key) => {
	return {
		type: ActionTypes.APP.SET_KEY,
		key
	}
};

// ============ export ===========

export default {
	setKey: actionSetKey
}
