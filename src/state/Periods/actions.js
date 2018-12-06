import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

const add = common.add(actionAdd);
const setActiveKey = common.setActiveKey(ActionTypes.PERIODS);
const setActiveKeys = common.setActiveKeys(actionSetActiveKeys);
const useIndexed = common.useIndexed(Select.periods.getSubstate, 'periods', actionAdd, actionAddIndex, actionEnsureError, actionRegisterUseIndexed);
const refreshAllIndexes = common.refreshAllIndexes(Select.periods.getSubstate, `periods`, actionAdd, actionAddIndex, actionClearIndexes, () => {});

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

function actionAddIndex(filter, order, count, start, data, changedOn) {
	return {
		type: ActionTypes.PERIODS.INDEX.ADD,
		filter: filter,
		order: order,
		count: count,
		start: start,
		data: data,
		changedOn
	}
}

function actionClearIndexes() {
	return {
		type: ActionTypes.PERIODS.INDEX.CLEAR_ALL,
	}
}

function actionClearUseIndexed(componentId) {
	return {
		type: ActionTypes.PERIODS.USE.INDEXED.CLEAR,
		componentId
	}
}

function actionRegisterUseIndexed(componentId, filterByActive, filter, order, start, length) {
	return {
		type: ActionTypes.PERIODS.USE.INDEXED.REGISTER,
		componentId,
		filterByActive,
		filter,
		order,
		start,
		length
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
	refreshAllIndexes,
	setActiveKey,
	setActiveKeys,
	useIndexed,
	useIndexedClear: actionClearUseIndexed
}
