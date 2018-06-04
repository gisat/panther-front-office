import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

// ============ creators ===========

function add(users){
	return dispatch => {
		if (!_.isArray(users)) users = [users];
		dispatch(actionAdd(users));
	};
}

function update(user) {
	return dispatch => {
		dispatch(actionUpdate(user));
	};
}

// ============ actions ===========

function actionAdd(users) {
	return {
		type: ActionTypes.USERS_ADD,
		data: users
	}
}

function actionUpdate(user) {
	return {
		type: ActionTypes.USERS_UPDATE,
		data: user
	}
}

// ============ export ===========

export default {
	add: add,
	update: update
}
