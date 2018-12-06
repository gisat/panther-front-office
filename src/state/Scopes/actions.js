import Action from '../Action';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import VisualsConfig from '../../constants/VisualsConfig';

import common from '../_common/actions';

// ============ creators ===========

const add = common.add(ActionTypes.SCOPES);
const useIndexed = common.useIndexed(Select.scopes.getSubstate, 'scopes', add, actionAddIndex, () => {}, actionUseIndexedRegister);
const refreshAllIndexes = common.refreshAllIndexes(Select.scopes.getSubstate, `scopes`, add, actionAddIndex, actionClearIndexes, () => {});

function setActiveKey(key) {
	return dispatch => {
		dispatch(actionSetActiveKey(key));
		dispatch(applyScopeConfiguration());
	};
}

function ensure(keys) {
	return dispatch => {
		dispatch(common.ensure(Select.scopes.getSubstate, 'scopes', keys, add, actionEnsureError));
	}
}

function applyScopeConfiguration() {
	return (dispatch, getState) => {
		let scopeConfig = Select.scopes.getActiveScopeConfiguration(getState());
		let htmlClass = null;
		let activeKey = null;

		if (scopeConfig){
			if (scopeConfig.hasOwnProperty(`dromasLpisChangeReview`)){
				dispatch(Action.lpisCases.load());
			}
			if (scopeConfig.style){
				let styleToUse = VisualsConfig[scopeConfig.style];
				htmlClass = styleToUse && styleToUse.htmlClass ? styleToUse.htmlClass : null;
				activeKey = scopeConfig.style;
			}
		}
		dispatch(Action.components.setApplicationStyleActiveKey(activeKey));
		dispatch(Action.components.setApplicationStyleHtmlClass('forScope', htmlClass));
	}
}

function loadAll() {
	return dispatch => {
		dispatch(common.loadAll('scopes', loadAllSuccess, loadAllError));
		dispatch(actionLoadRequest());
	}
}

function loadAllSuccess(result) {
	return dispatch => {
		dispatch(add(result));
	}
}

function loadAllError(result) {
	return dispatch => {
		dispatch(actionLoadError(result));
		throw new Error(`state/scopes/actions#loadAllError: ${result}`);
	}
}

function loadForKeys(keys){
	return (dispatch) => {
		let filter = {
			key: {
				in: keys
			}
		};
		return dispatch(common.loadFiltered('scopes', filter, add, actionLoadError));
	}
}

// ============ actions ===========

function actionAddIndex(filter, order, count, start, data, changedOn) {
	return {
		type: ActionTypes.SCOPES.INDEX.ADD,
		filter: filter,
		order: order,
		count: count,
		start: start,
		data: data,
		changedOn
	}
}

function actionEnsureError(err) {
	return {
		type: ActionTypes.SCOPES.ENSURE.ERROR,
		error: err
	}
}

function actionLoadError(err) {
	return {
		type: ActionTypes.SCOPES.LOAD.ERROR,
		error: err
	}
}

function actionLoadRequest() {
	return {
		type: ActionTypes.SCOPES.LOAD.REQUEST,
	}
}

function actionSetActiveKey(key) {
	return {
		type: ActionTypes.SCOPES.SET_ACTIVE_KEY,
		key: key
	}
}

function actionClearIndexes() {
	return {
		type: ActionTypes.SCOPES.INDEX.CLEAR_ALL,
	}
}

function actionUseIndexedRegister(componentId, filterByActive, filter, order, start, length) {
	return {
		type: ActionTypes.SCOPES.USE.INDEXED.REGISTER,
		componentId,
		filterByActive,
		filter,
		order,
		start,
		length
	}
}

// ============ export ===========

export default {
	add,
	setActiveKey,
	loadForKeys,
	loadAll,
	refreshAllIndexes,
	useIndexed
}
