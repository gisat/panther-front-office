import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

const add = common.add(actionAdd);
const setActiveKey = common.setActiveKey(actionSetActiveKey);

function loadByKeys(keys){
	return dispatch => {
		let filter = {
			key: {
				in: keys
			}
		};
		return dispatch(common.loadFiltered('themes', filter, actionAdd, actionLoadError));
	}
}

// ============ actions ===========

function actionAdd(periods) {
	return {
		type: ActionTypes.THEMES.ADD,
		data: periods
	}
}

function actionLoadError(error) {
	return {
		type: ActionTypes.THEMES.LOAD.ERROR,
		error: error
	}
}

function actionSetActiveKey(key) {
	return {
		type: ActionTypes.THEMES.SET_ACTIVE_KEY,
		key: key
	}
}

// ============ export ===========

export default {
	add,
	loadByKeys,
	setActiveKey,
}
