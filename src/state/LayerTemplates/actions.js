import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/actions';

// ============ creators ===========

const add = common.add(actionAdd);

// ============ actions ===========

function actionAdd(layerTemplates) {
	return {
		type: ActionTypes.LAYER_TEMPLATES_ADD,
		data: layerTemplates
	}
}

// ============ export ===========

export default {
	add
}
