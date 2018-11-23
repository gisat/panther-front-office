import _ from 'lodash';

import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

function add(data) {
	return (dispatch) => {
		if (data && data.length){
			dispatch(common.add(actionAdd)(data));
		}
		dispatch(actionInitializeForExt());
	}
}

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

// TODO It will be removed along with Ext
function actionInitializeForExt() {
	return {
		type: ActionTypes.ATTRIBUTES.INITIALIZE_FOR_EXT,
	}
}


// ============ export ===========

export default {
	add,
	initializeForExt: actionInitializeForExt,
	ensure: common.ensure.bind(this, Select.attributes.getSubstate, 'attributes', add, actionEnsureError),
}
