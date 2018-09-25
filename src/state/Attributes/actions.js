import _ from 'lodash';

import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/actions';

// ============ creators ===========

const add = common.add(actionAdd);


// ============ actions ===========

function actionAdd(attributes) {
	return {
		type: ActionTypes.ATTRIBUTES_ADD,
		data: attributes
	}
}

// ============ export ===========

export default {
	add
}
