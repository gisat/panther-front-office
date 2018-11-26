import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

const add = common.add(actionAdd);
const setActiveKey = common.setActiveKey(actionSetActiveKey);
const setActiveKeys = common.setActiveKeys(actionSetActiveKeys);
const useIndexed = common.useIndexed(Select.periods.getSubstate, 'periods', actionAdd, actionAddIndex, actionEnsureError, actionRegisterUseIndexed);

// ============ actions ===========

function actionAdd(periods) {
	return {
		type: ActionTypes.PERIODS.ADD,
		data: periods
	}
}

function actionEnsureError(error) {
	return {
		type: ActionTypes.PERIODS.ENSURE.ERROR,
		error: error
	}
}

function actionAddIndex(filter, order, count, start, data) {
	return {
		type: ActionTypes.PERIODS.INDEX.ADD,
		filter: filter,
		order: order,
		count: count,
		start: start,
		data: data
	}
}

function actionRegisterUseIndexed(componentId, filter, order, start, length) {
	return {
		type: ActionTypes.PERIODS.USE.INDEXED.REGISTER,
		componentId,
		filter,
		order,
		start,
		length
	}
}

function actionSetActiveKey(key) {
	return {
		type: ActionTypes.PERIODS.SET_ACTIVE_KEY,
		key: key
	}
}

function actionSetActiveKeys(keys) {
	return {
		type: ActionTypes.PERIODS.SET_ACTIVE_KEYS,
		keys: keys
	}
}

// ============ export ===========

export default {
	add,
	ensure: common.ensure.bind(this, Select.periods.getSubstate, 'periods', actionAdd, actionEnsureError),
	setActiveKey,
	setActiveKeys,
	useIndexed
}
