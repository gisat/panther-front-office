import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';


// ============ creators ===========

function add(periods) {
	return dispatch => {
		if (!_.isArray(periods)) periods = [periods];
		dispatch(actionAdd(periods));
	};
}

function setActiveKey(key) {
	return dispatch => {
		dispatch(actionSetActiveKey(key));
	};
}

// ============ actions ===========

function actionAdd(periods) {
	return {
		type: ActionTypes.PERIODS_ADD,
		data: periods
	}
}

function actionSetActiveKey(key) {
	return {
		type: ActionTypes.PERIODS_SET_ACTIVE,
		key: key
	}
}

// ============ export ===========

export default {
	add: add,
	setActiveKey: setActiveKey
}
