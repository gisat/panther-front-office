import _ from 'lodash';

import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

const add = common.add(actionAdd);


// ============ actions ===========

function actionAdd(attributes) {
	return {
		type: ActionTypes.ATTRIBUTES.ADD,
		data: attributes
	}
}

function actionEnsureError(err) {
	return {
		type: ActionTypes.ATTRIBUTES.ENSURE.ERROR,
		error: err
	}
}


// ============ export ===========

export default {
	add,
	ensure: common.ensure.bind(this, Select.attributes.getSubstate, 'attributes', actionAdd, actionEnsureError),
}
