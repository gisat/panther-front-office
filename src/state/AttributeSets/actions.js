import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import _ from 'lodash';
import common from "../_common/actions";


// ============ creators ===========

const add = common.add(actionAdd);
const setActiveKeys = common.setActiveKeys(actionSetActiveKeys);

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
	add,
	setActiveKeys,
	updateActive
}
