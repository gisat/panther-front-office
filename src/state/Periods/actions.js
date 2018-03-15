import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';


// ============ creators ===========

function add(periods) {
	return dispatch => {
		if (!_.isArray(periods)) periods = [periods];
		dispatch(actionAdd(periods));
	};
}

// ============ actions ===========

function actionAdd(periods) {
	return {
		type: ActionTypes.PERIODS_ADD,
		data: periods
	}
}

// ============ export ===========

export default {
	add: add,
}
