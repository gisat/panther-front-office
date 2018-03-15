import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';


// ============ creators ===========

function add(scopes) {
	return dispatch => {
		if (!_.isArray(scopes)) scopes = [scopes];
		dispatch(actionAdd(scopes));
	};
}

// ============ actions ===========

function actionAdd(scopes) {
	return {
		type: ActionTypes.SCOPES_ADD,
		data: scopes
	}
}

// ============ export ===========

export default {
	add: add,
}
