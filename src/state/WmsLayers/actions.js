import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';
import common from "../_common/actions";



// ============ creators ===========

const add = common.add(actionAdd);

// ============ actions ===========

function actionAdd(layers) {
	return {
		type: ActionTypes.WMS_LAYERS_ADD,
		data: layers
	}
}

// ============ export ===========

export default {
	add,
}
