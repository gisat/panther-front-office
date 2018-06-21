import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

// ============ creators ===========

function add(symbologies){
	return dispatch => {
		if (!_.isArray(symbologies)) symbologies = [symbologies];
		dispatch(actionAdd(symbologies));
	};
}

// ============ actions ===========

function actionAdd(symbologies) {
	return {
		type: ActionTypes.SYMBOLOGIES_ADD,
		data: symbologies
	}
}

// ============ export ===========

export default {
	add: add
}
