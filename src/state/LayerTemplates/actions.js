import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

// ============ creators ===========

function add(layerTemplates){
	return dispatch => {
		if (!_.isArray(layerTemplates)) layerTemplates = [layerTemplates];
		dispatch(actionAdd(layerTemplates));
	};
}

// ============ actions ===========

function actionAdd(layerTemplates) {
	return {
		type: ActionTypes.LAYER_TEMPLATES_ADD,
		data: layerTemplates
	}
}

// ============ export ===========

export default {
	add: add
}
