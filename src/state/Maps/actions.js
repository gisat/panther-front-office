import config from '../../config';
import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';


// ============ creators ===========

function add(maps) {
	return dispatch => {
		if (!_.isArray(maps)) maps = [maps];
		dispatch(actionAdd(maps));
	};
}

function initialize() {
	return dispatch => {
		dispatch(actionInitialize());
	};
}

function remove(mapKeys) {
	return dispatch => {
		if (!_.isArray(mapKeys)) mapKeys = [mapKeys];
		dispatch(actionRemove(mapKeys));
	};
}

function update(maps) {
	return dispatch => {
		if (!_.isArray(maps)) maps = [maps];
		dispatch(actionUpdate(maps));
	};
}

function updateDefaults(defaults) {
	return dispatch => {
		dispatch(actionUpdateDefaults(defaults));
	};
}

function setActive(key) {
	return dispatch => {
		dispatch(actionSetActive(key));
	};
}

// ============ actions ===========

function actionAdd(maps) {
	return {
		type: ActionTypes.MAPS_ADD,
		data: maps
	}
}

function actionRemove(mapKeys) {
	return {
		type: ActionTypes.MAPS_REMOVE,
		keys: mapKeys
	}
}

function actionUpdate(maps) {
	return {
		type: ActionTypes.MAPS_UPDATE,
		data: maps
	}
}

function actionUpdateDefaults(defaults) {
	return {
		type: ActionTypes.MAPS_UPDATE_DEFAULTS,
		data: defaults
	}
}

function actionSetActive(key) {
	return {
		type: ActionTypes.MAPS_SET_ACTIVE,
		key: key
	}
}

function actionInitialize() {
	return {
		type: ActionTypes.INITIALIZE
	}
}

// ============ export ===========

export default {
	add: add,
	initialize: initialize,
	remove: remove,
	update: update,
	updateDefaults: updateDefaults,
	setActive: setActive
}
