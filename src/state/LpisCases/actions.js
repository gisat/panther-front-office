import Action from '../Action';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import config from '../../config';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';
import queryString from 'query-string';
import utils from '../../utils/utils';

// ============ creators ===========

function load() {
	return (dispatch) => {
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata/lpis_cases');

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
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata/filtered/lpis_cases');

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

function createLpisCase() {
	return (dispatch, getState) => {
		let state = getState();
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata');
		let activeNewEditedCase = Select.lpisCases.getActiveEditedCase(state);

		let formData = new FormData();
		formData.append(
			`data`,
			JSON.stringify(
				{
					lpis_cases: [
						{
							uuid: activeNewEditedCase.key,
							data: activeNewEditedCase.data,
							status: "created"
						}
					]
				}
			)
		);

		formData.append(
			`configuration`,
			JSON.stringify(
				{
					scope_id: Select.scopes.getActiveScopeKey(state)
				}
			)
		);

		Object.keys(activeNewEditedCase.files).forEach((fileKey) => {
			formData.append(fileKey, activeNewEditedCase.files[fileKey]);
		});

		return fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Accept': 'application/json'
			},
			body: formData
		}).then(response => {
			if (response.status === 200) {
				return response.json();
			}
		}).then((responseContent) => {
			dispatch(_storeResponseContent(responseContent));
		});
	};
}

function editLpisCase() {
	return (dispatch, getState) => {
		let state = getState();
		let editedCase = Select.lpisCases.getActiveCaseEdited(state);

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata');

		return fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(
				{
					lpis_cases: [
						{
							id: editedCase.key,
							data: editedCase.data,
							status: editedCase.status
						}
					]
				}
			)
		}).then(response => {
			if (response.status === 200) {
				return response.json();
			}
		}).then((responseContent) => {
			dispatch(_storeResponseContent(responseContent));
		});
	}
}

function _storeResponseContent(content) {
	return (dispatch, getState) => {
		let state = getState();
		if (content) {
			let lpisCases = content['data']['lpis_cases'];
			let lpisCaseChanges = content['data']['lpis_case_changes'];
			let places = content['data']['places'];
			let views = content['data']['dataviews'];

			if(views && views.length) {
				let loadedViews = Select.views.getViews(state);
				dispatch(Action.views.add(_getMissingRecords(loadedViews, views)));
			}

			if (places && places.length) {
				let loadedPlaces = Select.places.getPlaces(state);
				dispatch(actionAddLpisCasePlaces(_getMissingRecords(loadedPlaces, places)));
			}

			if (lpisCaseChanges && lpisCaseChanges.length) {
				let loadedLpisCaseChanges = Select.lpisCases.getChanges(state);
				dispatch(actionAddLpisCaseChanges(_getMissingRecords(loadedLpisCaseChanges, lpisCaseChanges)));
			}

			if (lpisCases && lpisCases.length) {
				let loadedLpisCases = Select.lpisCases.getCases(state);
				let editedCases = Select.lpisCases.getEditedCases(state);
				let keysOkEditedCasesToRemove = _.compact(
					_.map(editedCases, (editedCase) => {
						return _.find(lpisCases, (lpisCase) => {
							return (lpisCase.id === editedCase.key || lpisCase.uuid === editedCase.key) && lpisCase.status !== "error";
						}) ? editedCase.key : null;
					})
				);
				dispatch(actionAddLpisCases(_getMissingRecords(loadedLpisCases, lpisCases)));
				if (keysOkEditedCasesToRemove.length) {
					dispatch(actionRemoveEditedCasesByKeys(keysOkEditedCasesToRemove));
				}
			}
		}
	}
}

function setActive(caseKey) {
	return (dispatch, getState) => {
		let state = getState();
		let cases = Select.lpisCases.getCases(state);
		let futureActiveCase = _.find(cases, {key: caseKey});
		let placeKey = futureActiveCase.data.place_id;

		dispatch(actionSetActive(caseKey));
		// dispatch(Action.places.setActive(placeKey));
	}
}

function redirectToActiveCaseView() {
	return (dispatch, getState) => {
		let state = getState();
		let activeCase = Select.lpisCases.getActiveCase(state);
		let view = _.find(Select.views.getViews(state), {key: activeCase.data.view_id});

		dispatch(Action.components.redirectToView({...view.data, key: view.key}));
	}
}

function loadCaseForActiveView() {
	return (dispatch, getState) => {
		let state = getState();
		let activeViewKey = Select.views.getActiveKey(state);
		let activeScope = Select.scopes.getActiveScopeData(state);

		if(!activeScope) {
			throw new Error(`LpisCases#actions#loadCaseForActiveView: active scope was not found`);
		}

		if(activeScope.configuration.dromasLpisChangeReview) {
			return dispatch(loadFiltered({view_id: Number(activeViewKey)}));
		}
	}
}

function setActiveCaseByActiveView() {
	return (dispatch, getState) => {
		let state = getState();
		let activeViewKey = Select.views.getActiveKey(state);
		let caseByActiveView = Select.lpisCases.getCaseByActiveView(state);
		if(caseByActiveView) {
			dispatch(Action.lpisCases.setActive(caseByActiveView.key));
		}
	}
}

// ============ helpers ===========

function _getMissingRecords(existing, toAdd) {
	let missing = [];

	if (!_.isArray(toAdd)) toAdd = [toAdd];
	if (!_.isArray(existing)) existing = [existing];

	toAdd.forEach((toAddOne) => {
		if (!_.find(existing, {key: toAddOne.id})) {
			missing.push({key: toAddOne.id, data: toAddOne.data});
		}
	});

	return missing;
}

// ============ actions ===========

function actionAddLpisCases(lpisCases) {
	return {
		type: ActionTypes.LPIS_CASES_ADD,
		data: lpisCases
	}
}

function actionAddLpisCaseChanges(lpisCaseChanges) {
	return {
		type: ActionTypes.LPIS_CASE_CHANGES_ADD,
		data: lpisCaseChanges
	}
}

function actionAddLpisCasePlaces(places) {
	return {
		type: ActionTypes.PLACES_ADD,
		data: places
	}
}

function actionChangeSearchString(searchString) {
	return {
		type: ActionTypes.LPIS_CASES_SEARCH_STRING_CHANGE,
		searchString: searchString
	}
}

function actionCreateNewActiveEditedCase() {
	return {
		type: ActionTypes.LPIS_CASES_CREATE_NEW_ACTIVE_EDITED_CASE
	}
}

function actionEditActiveEditedCase(column, value, file) {
	return {
		type: ActionTypes.LPIS_CASES_EDIT_ACTIVE_EDITED_CASE,
		column: column,
		value: value,
		file: file
	}
}

function actionRemoveEditedCasesByKeys(keys) {
	return {
		type: ActionTypes.LPIS_CASES_REMOVE_EDITED_CASES_BY_KEYS,
		keys: keys
	}
}

function actionSetActive(caseKey) {
	return  {
		type: ActionTypes.LPIS_CASES_SET_ACTIVE,
		key: caseKey
	}
}

// ============ export ===========

export default {
	load: load,
	createLpisCase: createLpisCase,
	changeSearchString: actionChangeSearchString,
	createNewActiveEditedCase: actionCreateNewActiveEditedCase,
	editActiveEditedCase: actionEditActiveEditedCase,
	editLpisCase: editLpisCase,
	setActive: setActive,
	redirectToActiveCaseView: redirectToActiveCaseView,
	loadCaseForActiveView: loadCaseForActiveView,
	setActiveCaseByActiveView: setActiveCaseByActiveView
}
