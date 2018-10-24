import Action from '../Action';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import VisualsConfig from '../../constants/VisualsConfig';

import _ from 'lodash';
import config from "../../config";
import path from "path";
import fetch from "isomorphic-fetch";
import queryString from 'query-string';

import common from '../_common/actions';

import Scope from '../../data/Scope';

const TTL = 5;

// ============ creators ===========

function setActiveScopeKey(key) {
	return dispatch => {
		dispatch(actionSetActiveScopeKey(key));
		dispatch(applyScopeConfiguration());
		dispatch(Action.dataviews.loadForScope(key));
	};
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
		dispatch({type: ActionTypes.SCOPES.LOAD.REQUEST});
	}
}

function loadAllSuccess(result) {
	return dispatch => {
		console.log('#####', result);
		dispatch({type: ActionTypes.SCOPES.ADD, data: result});
	}
}

function loadAllError(result) {
	return dispatch => {
		console.error('#####', result);
	}
}

// ============ actions ===========

function actionAdd(scopes) {
	return {
		type: ActionTypes.SCOPES_ADD,
		data: scopes
	}
}
function actionSetActiveScopeKey(key) {
	return {
		type: ActionTypes.SCOPES_SET_ACTIVE_KEY,
		key: key
	}
}

// ============ export ===========

export default {
	add: common.add(actionAdd),
	setActiveScopeKey: setActiveScopeKey,
	loadAll
}
