import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';


// ============ creators ===========

function add(attributes) {
	return dispatch => {
		if (!_.isArray(attributes)) attributes = [attributes];
		dispatch(actionAdd(attributes));
	};
}

// ============ actions ===========

function actionAdd(attributes) {
	return {
		type: ActionTypes.ATTRIBUTES_ADD,
		data: attributes
	}
}

// ============ export ===========

export default {
	add: add
}
