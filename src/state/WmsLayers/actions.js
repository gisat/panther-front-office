import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';


// ============ creators ===========

function add(layers) {
	return dispatch => {
		if (!_.isArray(layers)) layers = [layers];
		dispatch(actionAdd(layers));
	};
}

// ============ actions ===========

function actionAdd(layers) {
	return {
		type: ActionTypes.WMS_LAYERS_ADD,
		data: layers
	}
}

// ============ export ===========

export default {
	add: add,
}
