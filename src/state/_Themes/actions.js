import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

const add = common.add(actionAdd);
const setActiveKey = common.setActiveKey(actionSetActiveKey);

// ============ actions ===========

function actionAdd(periods) {
	return {
		type: ActionTypes.THEMES.ADD,
		data: periods
	}
}

function actionEnsureError(error) {
	return {
		type: ActionTypes.THEMES.ENSURE.ERROR,
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
	ensure: common.ensure.bind(this, Select.themes.getSubstate, 'themes', actionAdd, actionEnsureError),
	setActiveKey,
}
