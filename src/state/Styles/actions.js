import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

import common from "../_common/actions";

// ============ creators ===========

const add = common.add(actionAdd);

// ============ actions ===========

function actionAdd(styles) {
	return {
		type: ActionTypes.STYLES_ADD,
		data: styles
	}
}

// ============ export ===========

export default {
	add
}
