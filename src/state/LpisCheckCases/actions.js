import Action from '../Action';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import config from '../../config';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';

// ============ creators ===========

const LPISCHECKURL = 'backend/rest/metadata/lpischeck_cases';
const LPISCHECKFILTEREDURL = 'backend/rest/metadata/filtered/lpischeck_cases';

function load() {
	return (dispatch) => {
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, LPISCHECKURL);

		return fetch(url, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		}).then(response => {
			if (response.status === 200) {
				return response.json();
			}
		}).then((responseContent) => {
			dispatch(_storeResponseContent(responseContent));
		})
	}
}

function loadFiltered(filter) {
	return (dispatch) => {
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, LPISCHECKFILTEREDURL);

		return fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(filter)
		}).then(response => {
			if (response.status === 200) {
				return response.json();
			}
		}).then((responseContent) => {
			return dispatch(_storeResponseContent(responseContent));
		})
	}
}

function _storeResponseContent(content) {
	return (dispatch, getState) => {
		let state = getState();
		if (content) {
			let lpisCases = content['data']['lpischeck_cases'];

			if (lpisCases && lpisCases.length) {
				dispatch(actionAddLpisCases(lpisCases));
			}
		}
	}
}

function setActive(caseKey) {
	return (dispatch, getState) => {
		dispatch(actionSetActive(caseKey));
	}
}

function setCaseConfirmed(caseKey, confirmed) {
	return (dispatch, getState) => {

		let state = getState();
		let cases = Select.lpisCheckCases.getCases(state);
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
		let cases = Select.lpisCheckCases.getCases(state);
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
		let state = getState();
		let activeCase = Select.lpisCheckCases.getActiveCase(state);
		// let view = _.find(Select.views.getViews(state), {key: activeCase.data.view_id});

		// FIXME 
		let view = _.find(Select.views.getViews(state), {key: 5501});
		
		dispatch(Action.components.redirectToView({...view.data, key: view.key}));
	}
}

function loadCaseForActiveView() {
	return (dispatch, getState) => {
		let state = getState();
		let activeViewKey = Select.views.getActiveKey(state);
		let activeScope = Select.scopes.getActiveScopeData(state);

		if (!activeScope) {
			throw new Error(`LpisCheckCases#actions#loadCaseForActiveView: active scope was not found`);
		}

		return Promise
			.resolve()
			.then(() => {
				if (activeScope.configuration && activeScope.configuration.dromasLpisChangeReview) {
					return dispatch(loadFiltered({view_id: Number(activeViewKey)}));
				}
				if (activeScope.configuration && activeScope.configuration.headerComponent === 'LPISCheck') {
					return dispatch(loadFiltered({view_id: Number(activeViewKey)}));
				}
			});
	}
}

function setActiveCaseByActiveView() {
	return (dispatch, getState) => {
		let state = getState();
		let activeViewKey = Select.views.getActiveKey(state);
		let caseByActiveView = Select.lpisCheckCases.getCaseByActiveView(state);
		if (caseByActiveView) {
			dispatch(Action.lpisCheck.setActive(caseByActiveView.key));
		}
	}
}

// ============ helpers ===========

// ============ actions ===========

function actionAddLpisCases(lpisCases) {
	return {
		type: ActionTypes.LPISCHECK_CASES_ADD,
		data: lpisCases
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

// ============ export ===========

export default {
	load: load,
	changeSearch: actionChangeSearch,
	setActive,
	setCaseVisited,
	setCaseConfirmed,
	redirectToActiveCaseView,
	loadCaseForActiveView,
	setActiveCaseByActiveView,
}
