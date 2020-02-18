import Action from '../../Action';
import ActionTypes from '../../../constants/ActionTypes';
import Select from '../../Select';

import config from '../../../config/index';

import LpisCaseStatuses, {order as LpisCaseStatusOrder} from '../../../constants/LpisCaseStatuses';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';
import queryString from 'query-string';
import {utils} from '@gisatcz/ptr-utils'
import LayerPeriods from "../../LayerPeriods/actions";

// ============ creators ===========

function load() {
	return (dispatch) => {
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendPath, 'backend/rest/metadata/lpis_cases');

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
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendPath, 'backend/rest/metadata/filtered/lpis_cases');

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
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendPath, 'backend/rest/metadata');
		let activeNewEditedCase = Select.specific.lpisChangeReviewCases.getActiveEditedCase(state);

		let formData = new FormData();
		formData.append(
			`data`,
			JSON.stringify(
				{
					lpis_cases: [
						{
							uuid: activeNewEditedCase.key,
							data: activeNewEditedCase.data,
							status: LpisCaseStatuses.CREATED.database
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

function editLpisCase(caseKey) {
	return (dispatch, getState) => {
		let state = getState();
		let editedCase = caseKey ? _.find(Select.specific.lpisChangeReviewCases.getEditedCases(state), {key: caseKey}) : Select.specific.lpisChangeReviewCases.getActiveCaseEdited(state);
		let activeCase = Select.specific.lpisChangeReviewCases.getActiveCase(state);

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendPath, 'backend/rest/metadata');

		return fetch(url, {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				data: {
					lpis_cases: [
						{
							id: editedCase.key,
							data: editedCase.data,
							status: editedCase.status || activeCase.status
						}
					]
				}
			})
		}).then(response => {
			if (response.status === 200) {
				return response.json();
			}
		}).then((responseContent) => {
			dispatch(_storeResponseContent(responseContent));
		});
	}
}

function updateActiveCaseView() {
	return (dispatch, getState) => {
		let state = getState();
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendPath, 'backend/rest/dataview');
		let activeCase = Select.specific.lpisChangeReviewCases.getActiveCase(state);

		if (activeCase) {
			let activeCaseView = _.find(Select.dataviews.getViews(state), (view) => {
				return view.key === activeCase.data.view_id;
			});

			let mapState = Select.maps.getNavigator_deprecated(state);
			let mapsOverrides = Select.maps.getMapsOverrides(state);
			let mapDefaults = Select.maps.getMapDefaults(state);

			let updatedActiveCaseView = {
				_id: activeCaseView.key,
				conf: {
					...activeCaseView.data.conf,
					mapsMetadata: mapsOverrides,
					mapDefaults: mapDefaults,
					worldWindState: {
						location: mapState.lookAtLocation,
						range: mapState.range
					}
				}
			};

			return fetch(url, {
				method: 'PUT',
				credentials: 'include',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({data: updatedActiveCaseView})
			}).then(response => {
				if (response.status === 200) {
					return response.json();
				}
			}).then((responseContent) => {
				dispatch(_storeResponseContent(responseContent));
			});
		}
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

			if (views && views.length) {
				dispatch(Action.dataviews.add(transformIdsToKeys(views)));
			}

			if (places && places.length) {
				dispatch(actionAddLpisCasePlaces(transformIdsToKeys(places)));
			}

			if (lpisCaseChanges && lpisCaseChanges.length) {
				dispatch(actionAddLpisCaseChanges(transformIdsToKeys(lpisCaseChanges)));
			}

			if (lpisCases && lpisCases.length) {
				let editedCases = Select.specific.lpisChangeReviewCases.getEditedCases(state);

				let clearedLpisCases = _.filter(lpisCases, (lpisCase) => {
					if (lpisCase.status === "error"){
						console.warn("LpisChangeReviewCases#actions#_storeResponseContent: Case wasn't created!");
					}
					return lpisCase.status !== "error";
				});

				let keysOkEditedCasesToRemove = _.compact(
					_.map(editedCases, (editedCase) => {
						return _.find(clearedLpisCases, (lpisCase) => {
							return (lpisCase.id === editedCase.key || lpisCase.uuid === editedCase.key) && lpisCase.status !== "error";
						}) ? editedCase.key : null;
					})
				);

				if (clearedLpisCases.length){
					dispatch(actionAddLpisCases(transformIdsToKeys(clearedLpisCases)));
				}
				if (keysOkEditedCasesToRemove.length) {
					dispatch(actionRemoveEditedCasesByKeys(keysOkEditedCasesToRemove));
				}

				let nextActiveCaseKey = Select.specific.lpisChangeReviewCases.getNextActiveCaseKey(state);
				if(!nextActiveCaseKey) {
					dispatch(setNextActiveCaseKey());
				}
			}
		}
	}
}

function setActive(caseKey) {
	return (dispatch, getState) => {

		dispatch(actionSetActive(caseKey));

		let state = getState();
		let cases = Select.specific.lpisChangeReviewCases.getCases(state);
		let lpisCase = _.find(cases, {key: caseKey});
		if (lpisCase && lpisCase.data && lpisCase.data.geometry_before) {
			dispatch(LayerPeriods.loadForKey('lpisCase' + lpisCase.key, lpisCase.data.geometry_before));
		}
	}
}

function redirectToActiveCaseView() {
	return (dispatch, getState) => {
		let state = getState();
		let activeCase = Select.specific.lpisChangeReviewCases.getActiveCase(state);
		let view = _.find(Select.dataviews.getViews(state), {key: activeCase.data.view_id});

		dispatch(Action.components.redirectToView({...view.data, key: view.key}));
	}
}

function redirectToNextViewFromActiveView() {
	return (dispatch, getState) => {
		let state = getState();
		let nextActiveCaseKey = Select.specific.lpisChangeReviewCases.getNextActiveCaseKey(state);
		let nextLpisCase = _.find(Select.specific.lpisChangeReviewCases.getCases(state), {key: nextActiveCaseKey});

		if(nextLpisCase) {
			let view = _.find(Select.dataviews.getViews(state), {key: nextLpisCase.data.view_id});
			dispatch(Action.components.redirectToView({...view.data, key: view.key}));
		}
	}
}

function setNextActiveCaseKey() {
	return (dispatch, getState) => {
		let state = getState();
		let activeCase = Select.specific.lpisChangeReviewCases.getActiveCase(state);

		if(activeCase) {
			let activeUserDromasLpisChangeReviewGroup = Select.users.getActiveUserDromasLpisChangeReviewGroup(state);
			let lpisCases = Select.specific.lpisChangeReviewCases.getAllCasesSortedByStatusAndDate(state, {activeUserDromasLpisChangeReviewGroup: activeUserDromasLpisChangeReviewGroup});

			let activeCaseIndex = _.findIndex(lpisCases, {key: activeCase.key});
			if(lpisCases[activeCaseIndex+1] && lpisCases[activeCaseIndex+1].status === activeCase.status) {
				dispatch(actionSetNextActiveCaseKey(lpisCases[activeCaseIndex+1].key));
			}
		}
	}
}

function loadCaseForActiveView() {
	return (dispatch, getState) => {
		let state = getState();
		let activeViewKey = Select.dataviews.getActiveKey(state);
		let activeScope = Select.scopes.getActiveScopeData(state);

		if (!activeScope) {
			throw new Error(`LpisChangeReviewCases#actions#loadCaseForActiveView: active scope was not found`);
		}

		return Promise
			.resolve()
			.then(() => {
				if (activeScope.data.configuration && activeScope.data.configuration.dromasLpisChangeReview) {
					return dispatch(loadFiltered({view_id: Number(activeViewKey)}));
				}
			});
	}
}

function setActiveCaseByActiveView() {
	return (dispatch, getState) => {
		let state = getState();
		let activeViewKey = Select.dataviews.getActiveKey(state);
		let caseByActiveView = Select.specific.lpisChangeReviewCases.getCaseByActiveView(state);
		if (caseByActiveView) {
			dispatch(Action.specific.lpisChangeReviewCases.setActive(caseByActiveView.key));
		}
	}
}

function editActiveCase(property, value) {
	return (dispatch, getState) => {
		let state = getState();
		let activeCaseEdited = Select.specific.lpisChangeReviewCases.getActiveCaseEdited(state);
		let activeCaseKey = Select.specific.lpisChangeReviewCases.getActiveCaseKey(state);

		if(property) {
			return dispatch(Action.specific.lpisChangeReviewCases.actionEditActiveCase(property, value));
		}
	}
}

function editActiveCaseStatus(status) {
	return (dispatch, getState) => {
		let state = getState();
		let activeCaseEdited = Select.specific.lpisChangeReviewCases.getActiveCaseEdited(state);
		let activeCaseKey = Select.specific.lpisChangeReviewCases.getActiveCaseKey(state);

		if(status) {
			return dispatch(Action.specific.lpisChangeReviewCases.actionEditActiveCaseStatus(status));
		}
	}
}

function editCaseStatus(caseKey, status) {
	return (dispatch) => {
		if(caseKey && status) {
			return dispatch(actionEditCaseStatus(caseKey, status));
		}
	}
}

function editActiveCaseMapSources() {
	return (dispatch, getState) => {
		let state = getState();
		let usedSources = Select.maps.getUsedSourcesForAllMaps(state);
		if(usedSources && usedSources.length) {
			return dispatch(Action.specific.lpisChangeReviewCases.actionEditActiveCase('evaluation_used_sources', _.sortBy(usedSources).join(`\n`)));
		}
	}
}

function clearActiveEditedCase() {
	return (dispacth, getState) => {
		let state = getState();
		let activeEditedCaseKey = Select.specific.lpisChangeReviewCases.getActiveEditedCaseKey(state);
		dispacth(actionClearEditedCase(activeEditedCaseKey));
	}
}

function changeSelectedStatuses(statuses) {
	return dispatch => {
		if (statuses && !_.isArray(statuses)) statuses = [statuses];
		dispatch(actionChangeSelectedStatuses(statuses));
	};
}

function userActionSaveEvaluation() {
	return (dispatch) => {
		dispatch(Action.specific.lpisChangeReviewCases.editActiveCaseMapSources());
		dispatch(Action.specific.lpisChangeReviewCases.editActiveCaseStatus(LpisCaseStatuses.EVALUATION_CREATED.database));
		dispatch(Action.specific.lpisChangeReviewCases.updateActiveCaseView());
		dispatch(Action.specific.lpisChangeReviewCases.editLpisCase());
		dispatch(redirectToNextViewFromActiveView());
	}
}

function userActionSaveAndApproveEvaluation() {
	return (dispatch) => {
		dispatch(Action.specific.lpisChangeReviewCases.editActiveCaseMapSources());
		dispatch(Action.specific.lpisChangeReviewCases.editActiveCaseStatus(LpisCaseStatuses.EVALUATION_APPROVED.database));
		dispatch(Action.specific.lpisChangeReviewCases.updateActiveCaseView());
		dispatch(Action.specific.lpisChangeReviewCases.editLpisCase());
		dispatch(redirectToNextViewFromActiveView());
	}
}

function userActionApproveEvaluation() {
	return (dispatch) => {
		dispatch(Action.specific.lpisChangeReviewCases.editActiveCaseStatus(LpisCaseStatuses.EVALUATION_APPROVED.database));
		dispatch(Action.specific.lpisChangeReviewCases.editLpisCase());
		dispatch(redirectToNextViewFromActiveView());
	}
}

function userActionRejectEvaluation() {
	return (dispatch) => {
		dispatch(Action.specific.lpisChangeReviewCases.editActiveCaseStatus(LpisCaseStatuses.CREATED.database));
		dispatch(Action.specific.lpisChangeReviewCases.editLpisCase());
		dispatch(redirectToNextViewFromActiveView());
	}
}

function userActionCloseEvaluation() {
	return (dispatch) => {
		dispatch(Action.specific.lpisChangeReviewCases.editActiveCaseStatus(LpisCaseStatuses.CLOSED.database));
		dispatch(Action.specific.lpisChangeReviewCases.editLpisCase());
		dispatch(redirectToNextViewFromActiveView());
	}
}

function userActionInvalidate(caseKey) {
	return (dispatch) => {
		dispatch(editCaseStatus(caseKey, LpisCaseStatuses.INVALID.database));
		dispatch(editLpisCase(caseKey));
	}
}

// ============ helpers ===========

function transformIdsToKeys(records) {
	return _.map(records, (record) => {
		return {
			key: record.id,
			...record
		}
	});
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

function actionChangeSelectedStatuses(statuses) {
	return {
		type: ActionTypes.LPIS_CASES_SELECTED_STATUS_CHANGE,
		selectedStatuses: statuses
	}
}

function actionCreateNewActiveEditedCase(key) {
	return {
		type: ActionTypes.LPIS_CASES_CREATE_NEW_ACTIVE_EDITED_CASE,
		key: key
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

function actionEditActiveCase(property, value) {
	return {
		type: ActionTypes.LPIS_CASE_EDIT_ACTIVE_CASE,
		property,
		value
	}
}

function actionEditActiveCaseStatus(status) {
	return {
		type: ActionTypes.LPIS_CASE_EDIT_ACTIVE_CASE_STATUS,
		status
	}
}

function actionEditCaseStatus(caseKey, status) {
	return {
		type: ActionTypes.LPIS_CASE_EDIT_CASE_STATUS,
		key: caseKey,
		status
	}
}

function actionClearEditedCase(key) {
	return {
		type: ActionTypes.LPIS_CASES_CLEAR_EDITED_CASE,
		key
	}
}

function actionRemoveEditedCasesByKeys(keys) {
	return {
		type: ActionTypes.LPIS_CASES_REMOVE_EDITED_CASES_BY_KEYS,
		keys: keys
	}
}

function actionSetActive(caseKey) {
	return {
		type: ActionTypes.LPIS_CASES_SET_ACTIVE,
		key: caseKey
	}
}

function actionSetNextActiveCaseKey(nextActiveCaseKey) {
	return {
		type: ActionTypes.LPIS_CASE_SET_NEXT_ACTIVE_CASE_KEY,
		key: nextActiveCaseKey
	}
}

// ============ export ===========

export default {
	load: load,
	createLpisCase: createLpisCase,
	changeSearchString: actionChangeSearchString,
	changeSelectedStatuses: changeSelectedStatuses,
	createNewActiveEditedCase: actionCreateNewActiveEditedCase,
	editActiveEditedCase: actionEditActiveEditedCase,
	editLpisCase: editLpisCase,
	setActive: setActive,
	redirectToActiveCaseView: redirectToActiveCaseView,
	loadCaseForActiveView: loadCaseForActiveView,
	setActiveCaseByActiveView: setActiveCaseByActiveView,
	editActiveCase: editActiveCase,
	clearActiveEditedCase,
	editActiveCaseStatus,
	updateActiveCaseView,
	editActiveCaseMapSources,
	userActionSaveEvaluation,
	userActionApproveEvaluation,
	userActionCloseEvaluation,
	userActionRejectEvaluation,
	userActionSaveAndApproveEvaluation,
	actionEditActiveCase,
	actionEditActiveCaseStatus,
	userActionInvalidate,
	editCaseStatus
}
