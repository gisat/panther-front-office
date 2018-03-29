import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';


// ============ creators ===========

function update(user) {
	return dispatch => {
		dispatch(actionUpdate(user));
	};
}

// ============ actions ===========

function actionUpdate(user) {
	return {
		type: ActionTypes.USER_UPDATE,
		data: user
	}
}

// ============ export ===========

export default {
	update: update
}
