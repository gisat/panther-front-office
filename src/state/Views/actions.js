import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

// ============ creators ===========

function add(views) {
	return dispatch => {
		if (!_.isArray(views)) views = [views];
		dispatch(actionAdd(views));
	};
}

// ============ actions ===========

function actionAdd(views) {
	return {
		type: ActionTypes.VIEWS_ADD,
		data: views
	}
}

// ============ export ===========

export default {
	add: add
}
