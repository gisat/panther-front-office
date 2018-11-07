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

function loadForKeys(keys) {
	return (dispatch) => {
		let filter = {
			key: {
				in: keys
			}
		};
		return dispatch(common.loadFiltered('attributes', filter, add, actionLoadError));
	}
}


// ============ actions ===========

function actionAdd(attributes) {
	return {
		type: ActionTypes.ATTRIBUTES.ADD,
		data: attributes
	}
}

function actionLoadError(err) {
	return {
		type: ActionTypes.ATTRIBUTES.LOAD.ERROR,
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
	loadForKeys
}
