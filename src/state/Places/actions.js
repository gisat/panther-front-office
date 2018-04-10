import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';


// ============ creators ===========

function add(places) {
	return dispatch => {
		if (!_.isArray(places)) places = [places];
		dispatch(actionAdd(places));
	};
}

function setActive(key) {
	return dispatch => {
		dispatch(actionSetActive(key));
	};
}

function setActiveKeys(places) {
	return dispatch => {
		if (!_.isArray(places)) places = [places];
		dispatch(actionSetActiveKeys(places));
	};
}

// ============ actions ===========

function actionAdd(places) {
	return {
		type: ActionTypes.PLACES_ADD,
		data: places
	}
}

function actionSetActive(key) {
	return {
		type: ActionTypes.PLACES_SET_ACTIVE,
		key: key
	}
}

function actionSetActiveKeys(places) {
	return {
		type: ActionTypes.PLACES_SET_ACTIVE_MULTI,
		data: places
	}
}

// ============ export ===========

export default {
	add: add,
	setActive: setActive,
	setActiveKeys: setActiveKeys
}
