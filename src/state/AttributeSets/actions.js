import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import _ from 'lodash';


// ============ creators ===========

function add(attributeSets) {
	return dispatch => {
		if (!_.isArray(attributeSets)) attributeSets = [attributeSets];
		dispatch(actionAdd(attributeSets));
	};
}

function setActiveKeys(keys) {
	return (dispatch) => {
		if (!_.isArray(keys)) keys = [keys];
		dispatch(actionSetActiveKeys(keys));
	};
}

function updateActive(keys) {
	return (dispatch, getState) => {
		let activeKeys = Select.attributeSets.getActiveKeys(getState());
		let diff = _.difference(activeKeys, keys);
		if (diff.length || !activeKeys){
			dispatch(setActiveKeys(keys));
		}
	};
}

// ============ actions ===========

function actionAdd(attributeSets) {
	return {
		type: ActionTypes.ATTRIBUTE_SETS_ADD,
		data: attributeSets
	}
}

function actionSetActiveKeys(attributeSets) {
	return {
		type: ActionTypes.ATTRIBUTE_SETS_SET_ACTIVE_MULTI,
		keys: attributeSets
	}
}

// ============ export ===========

export default {
	add: add,
	updateActive: updateActive
}
