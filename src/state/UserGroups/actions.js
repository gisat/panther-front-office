import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';


// ============ creators ===========

function add(groups){
	return dispatch => {
		if (!_.isArray(groups)) groups = [groups];
		dispatch(actionAdd(groups));
	};
}

// ============ actions ===========

function actionAdd(groups) {
	return {
		type: ActionTypes.USER_GROUPS_ADD,
		data: groups
	}
}

// ============ export ===========

export default {
	add: add
}
