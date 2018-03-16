import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';


// ============ creators ===========

function add(scopes) {
	return dispatch => {
		if (!_.isArray(scopes)) scopes = [scopes];
		dispatch(actionAdd(scopes));
	};
}
function setActiveScopeKey(key) {
	return dispatch => {
		dispatch(actionSetActiveScopeKey(key));
	};
}

// ============ actions ===========

function actionAdd(scopes) {
	return {
		type: ActionTypes.SCOPES_ADD,
		data: scopes
	}
}
function actionSetActiveScopeKey(key) {
	return {
		type: ActionTypes.SCOPES_SET_ACTIVE_KEY,
		activeScopeKey: key
	}
}

// ============ export ===========

export default {
	add: add,
	setActiveScopeKey: setActiveScopeKey
}
