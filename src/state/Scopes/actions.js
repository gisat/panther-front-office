import Action from '../Action';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import VisualsConfig from '../../constants/VisualsConfig';

import common from '../_common/actions';

// ============ creators ===========


function setActiveKey(key) {
	return dispatch => {
		dispatch(actionSetActiveKey(key));

		// todo for this action I need to have scope data
		dispatch(applyScopeConfiguration());
	};
}

function ensureForKey(key) {
	return dispatch => {
		dispatch(common.ensure(Select.scopes.getSubstate, 'scopes', {key: key}, actionAdd, actionEnsureError));
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
		dispatch(actionAdd(result));
	}
}

function loadAllError(result) {
	return dispatch => {
		dispatch(actionLoadError(result));
		throw new Error(`state/scopes/actions#loadAllError: ${result}`);
	}
}

// ============ actions ===========

function actionAdd(scopes) {
	return {
		type: ActionTypes.SCOPES.ADD,
		data: scopes
	}
}

function actionAddIndex(filter, order, count, start, data) {
	return {
		type: ActionTypes.SCOPES.INDEX.ADD,
		filter: filter,
		order: order,
		count: count,
		start: start,
		data: data
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

// ============ export ===========

export default {
	add: common.add(actionAdd),
	setActiveKey,
	loadAll,
	ensureForKey
}
