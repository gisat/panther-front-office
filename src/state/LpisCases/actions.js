import Action from '../Action';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import config from '../../config';

import LpisCaseStatuses, {order as LpisCaseStatusOrder} from '../../constants/LpisCaseStatuses';

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

function editLpisCase() {
	return (dispatch, getState) => {
		let state = getState();
		let editedCase = Select.lpisCases.getActiveCaseEdited(state);
		let activeCase = Select.lpisCases.getActiveCase(state);
		let usedSources = Select.maps.getUsedSourcesForAllMaps(state);

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata');

		let data = editedCase.data;
		if(usedSources && usedSources.length) {
			data['evaluation_used_sources'] = usedSources.join(`, `);
		}

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
							data: data,
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

function editLpisCaseStatus(caseKey, status) {
	return (dispatch) => {
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata');

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
							id: caseKey,
							data: {},
							status: status
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

function updateActiveCaseView(update) {
	return (dispatch, getState) => {
		let state = getState();
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/dataview');
		let activeCase = Select.lpisCases.getActiveCase(state);

		if (activeCase) {
			let activeCaseView = _.find(Select.views.getViews(state), (view) => {
				return view.key === activeCase.data.view_id;
			});

			let mapState = Select.maps.getNavigator(state);
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
				dispatch(Action.views.add(transformIdsToKeys(views)));
			}

			if (places && places.length) {
				dispatch(actionAddLpisCasePlaces(transformIdsToKeys(places)));
			}

			if (lpisCaseChanges && lpisCaseChanges.length) {
				dispatch(actionAddLpisCaseChanges(transformIdsToKeys(lpisCaseChanges)));
			}

			if (lpisCases && lpisCases.length) {
				let editedCases = Select.lpisCases.getEditedCases(state);
				let keysOkEditedCasesToRemove = _.compact(
					_.map(editedCases, (editedCase) => {
						return _.find(lpisCases, (lpisCase) => {
							return (lpisCase.id === editedCase.key || lpisCase.uuid === editedCase.key) && lpisCase.status !== "error";
						}) ? editedCase.key : null;
					})
				);
				dispatch(actionAddLpisCases(transformIdsToKeys(lpisCases)));
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

		if (!activeScope) {
			throw new Error(`LpisCases#actions#loadCaseForActiveView: active scope was not found`);
		}

		return Promise
			.resolve()
			.then(() => {
				if (activeScope.configuration && activeScope.configuration.dromasLpisChangeReview) {
					return dispatch(loadFiltered({view_id: Number(activeViewKey)}));
				}
			});
	}
}

function setActiveCaseByActiveView() {
	return (dispatch, getState) => {
		let state = getState();
		let activeViewKey = Select.views.getActiveKey(state);
		let caseByActiveView = Select.lpisCases.getCaseByActiveView(state);
		if (caseByActiveView) {
			dispatch(Action.lpisCases.setActive(caseByActiveView.key));
		}
	}
}

function editActiveCase(column, value) {
	return (dispatch, getState) => {
		let state = getState();
		let activeCaseEdited = Select.lpisCases.getActiveCaseEdited(state);
		let activeCaseKey = Select.lpisCases.getActiveCaseKey(state);

		if (activeCaseEdited) {
			return dispatch(Action.lpisCases.editActiveEditedCase(column, value));
		} else {
			return dispatch(Action.lpisCases.createNewActiveEditedCase(activeCaseKey, column, value));
		}
	}
}

function editActiveCaseStatus(status) {
	return (dispatch, getState) => {
		let state = getState();
		let activeCaseEdited = Select.lpisCases.getActiveCaseEdited(state);
		let activeCaseKey = Select.lpisCases.getActiveCaseKey(state);

		if (activeCaseEdited) {
			return dispatch(Action.lpisCases.editActiveEditedCase(null, null, null, status));
		} else {
			return dispatch(Action.lpisCases.createNewActiveEditedCase(activeCaseKey, null, null, status));
		}
	}
}

function clearActiveEditedCase() {
	return (dispacth, getState) => {
		let state = getState();
		let activeEditedCaseKey = Select.lpisCases.getActiveEditedCaseKey(state);
		dispacth(actionClearEditedCase(activeEditedCaseKey));
	}
}

function saveCaseAsCreated() {
	return (dispatch, getState) => {
		dispatch(Action.lpisCases.editActiveCaseStatus(LpisCaseStatuses.CREATED.database));
		dispatch(Action.lpisCases.editLpisCase());
	}
}

function setCaseAsCreated() {
	return (dispatch, getState) => {
		let state = getState();
		dispatch(
			Action.lpisCases.editLpisCaseStatus(
				Select.lpisCases.getActiveCaseKey(state),
				LpisCaseStatuses.CREATED.database
			)
		);
	}
}

function saveCaseAsEvaluated() {
	return (dispatch, getState) => {
		dispatch(Action.lpisCases.updateActiveCaseView());
		dispatch(Action.lpisCases.editActiveCaseStatus(LpisCaseStatuses.EVALUATION_CREATED.database));
		dispatch(Action.lpisCases.editLpisCase());
	}
}

function setCaseAsEvaluated() {
	return (dispatch, getState) => {
		let state = getState();
		dispatch(
			Action.lpisCases.editLpisCaseStatus(
				Select.lpisCases.getActiveCaseKey(state),
				LpisCaseStatuses.EVALUATION_CREATED.database
			)
		);
	}
}

function saveCaseAsApproved() {
	return (dispatch, getState) => {
		let state = getState();
		dispatch(Action.lpisCases.updateActiveCaseView());
		dispatch(Action.lpisCases.editActiveCaseStatus(LpisCaseStatuses.EVALUATION_APPROVED.database));
		dispatch(Action.lpisCases.editLpisCase());
	}
}

function saveCaseAsClosed() {
	return (dispatch, getState) => {
		let state = getState();
		dispatch(
			Action.lpisCases.editLpisCaseStatus(
				Select.lpisCases.getActiveCaseKey(state),
				LpisCaseStatuses.CLOSED.database
			)
		);
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

function actionCreateNewActiveEditedCase(key, column, value, status) {
	return {
		type: ActionTypes.LPIS_CASES_CREATE_NEW_ACTIVE_EDITED_CASE,
		key: key,
		column: column,
		value: value,
		status: status
	}
}

function actionEditActiveEditedCase(column, value, file, status) {
	return {
		type: ActionTypes.LPIS_CASES_EDIT_ACTIVE_EDITED_CASE,
		column: column,
		value: value,
		file: file,
		status: status
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
	setActiveCaseByActiveView: setActiveCaseByActiveView,
	editActiveCase: editActiveCase,
	clearActiveEditedCase,
	saveCaseAsCreated,
	saveCaseAsEvaluated,
	saveCaseAsApproved,
	saveCaseAsClosed,
	editActiveCaseStatus,
	editLpisCaseStatus,
	updateActiveCaseView
}
