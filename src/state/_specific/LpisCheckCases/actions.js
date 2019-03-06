import Action from '../../Action';
import ActionTypes from '../../../constants/ActionTypes';
import Select from '../../Select';
import common from '../../_common/actions';

import config from '../../../config';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';
import LayerPeriods from "../../LayerPeriods/actions";

// ============ creators ===========

const useIndexed = common.useIndexed(Select.specific.lpisCheckCases.getSubstate, 'lpischeck_cases', ActionTypes.LPIS_CASES);

function setActive(caseKey) {
	return (dispatch, getState) => {
		dispatch(actionSetActive(caseKey));

		let state = getState();
		let cases = Select.specific.lpisCheckCases.getAll(state);
		let lpisCase = _.find(cases, {key: caseKey});
		if (lpisCase && lpisCase.data && lpisCase.data.geometry) {
			dispatch(LayerPeriods.loadForKey('lpisCase' + lpisCase.key, lpisCase.data.geometry));
		}
	}
}

function setCaseConfirmed(caseKey, confirmed) {
	return (dispatch, getState) => {

		let state = getState();
		let cases = Select.specific.lpisCheckCases.getAll(state);
		let lpisCase = cases.find((c) => c.key === caseKey);
		if (lpisCase && lpisCase.data) {

			const data = {
				data: {
					lpischeck_cases: [
						{
							key: caseKey, 
							data: {
								confirmed
							}
						}
					]
				}
			}

			return _updateCase(data).then(() => {
				return dispatch(actionUpdateCase(caseKey, {...lpisCase, data: {confirmed}}));
			})	
		}
	}
}

function setCaseVisited(caseKey, visited) {
	return (dispatch, getState) => {

		let state = getState();
		let cases = Select.specific.lpisCheckCases.getAll(state);
		let lpisCase = cases.find((c) => c.key === caseKey);
		if (lpisCase && lpisCase.data) {

			const data = {
				data: {
					lpischeck_cases: [
						{
							key: caseKey, 
							data: {
								visited: visited
							}
						}
					]
				}
			}

			return _updateCase(data).then(() => {
				return dispatch(actionUpdateCase(caseKey, {...lpisCase, data: {visited: visited}}));
			})	
		}
	}
}

function _updateCase(data) {
	let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata');
	return fetch(url, {
		method: 'PUT',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify(data)
	}).then(response => {
		if (response.status === 200) {
			return response.json();
		}
	})
}

function redirectToActiveCaseView() {
	return (dispatch, getState) => {
		const state = getState();
		const activeCase = Select.specific.lpisCheckCases.getActiveCase(state);
		
		return dispatch(Action.dataviews.loadFiltered({key: {in: [parseInt(activeCase.data.dataview_key)]}}))
		.then(() => {
			const state = getState();
			const view = Select.dataviews.getView(state, activeCase.data.dataview_key); //by key
			dispatch(Action.components.redirectToView({...view.data, key: view.key}));
		})
	}
}

function loadCaseForActiveView() {
	return (dispatch, getState) => {
		let state = getState();
		let activeViewKey = Select.dataviews.getActiveKey(state);
		let activeScope = Select.scopes.getActiveScopeData(state);

		if (!activeScope) {
			throw new Error(`LpisCheckCases#actions#loadCaseForActiveView: active scope was not found`);
		}
		
		if (activeScope.data.configuration && activeScope.data.configuration.lpisCheckReview) {
			return dispatch(common.loadFiltered('lpischeck_cases', ActionTypes.LPIS_CASES, {dataview_key: Number(activeViewKey)}));
		}else if (activeScope.data.configuration && activeScope.data.configuration.headerComponent === 'LPISCheck') {
			return dispatch(common.loadFiltered('lpischeck_cases', ActionTypes.LPIS_CASES, {dataview_key: Number(activeViewKey)}));
		}
	}
}

function setActiveCaseByActiveView() {
	return (dispatch, getState) => {
		let state = getState();
		let caseByActiveView = Select.specific.lpisCheckCases.getCaseByActiveView(state);
		if (caseByActiveView) {
			dispatch(Action.specific.lpisCheckCases.setActive(caseByActiveView.key));
		}
	}
}

// ============ helpers ===========

// ============ actions ===========

function actionClearUseindexed(componentId) {
	return {
		type: ActionTypes.LPIS_CASES.USE.INDEXED.CLEAR,
		componentId
	}
}


function actionChangeSearch(searchParam) {
	return {
		type: ActionTypes.LPIS_CHECK_CASES_SEARCH_PARAM_CHANGE,
		searchParam,
	}
}

function actionSetActive(caseKey) {
	return {
		type: ActionTypes.LPISCHECK_CASES_SET_ACTIVE,
		key: caseKey
	}
}

function actionUpdateCase(caseKey, lpisCase) {
	return {
		type: ActionTypes.LPISCHECK_UPDATE_CASE,
		lpisCase,
	}
}

function setChanging(changing) {
	return {
		type: ActionTypes.LPIS_CHECK_CASES_SET_CHANGING_ACTIVE,
		value: changing,
	}
}

// ============ export ===========

export default {
	changeSearch: actionChangeSearch,
	useIndexed,
	useIndexedClear: actionClearUseindexed,
	setActive,
	setCaseVisited,
	setCaseConfirmed,
	setChanging,
	redirectToActiveCaseView,
	loadCaseForActiveView,
	setActiveCaseByActiveView,
}
