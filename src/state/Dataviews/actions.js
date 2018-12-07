import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import fetch from "isomorphic-fetch";
import config from "../../config";
import path from "path";
import queryString from 'query-string';
import Dataview from "../../data/Dataview";
import Select from "../Select";

import AttributesActions from "../Attributes/actions";
import AttributeSetsActions from "../AttributeSets/actions";
import LpisCasesActions from "../LpisCases/actions";
import ScopesActions from "../Scopes/actions";
import PeriodsActions from "../Periods/actions";
import PlacesActions from "../Places/actions";
import ThemesActions from "../_Themes/actions";

import common from "../_common/actions";
import Action from "../Action";

const TTL = 5;

// ============ creators ===========

const add = common.add(ActionTypes.DATAVIEWS);
const setActiveKey = common.setActiveKey(ActionTypes.DATAVIEWS);
const useIndexed = common.useIndexed(Select.dataviews.getSubstate, 'dataviews', add, actionAddIndex, ensureForScopeError, registerUseIndexed);
const useKeys = common.useKeys(Select.dataviews.getSubstate, `dataviews`, add, () => {}, actionUseKeysRegister);
const refreshAllIndexes = common.refreshAllIndexes(Select.dataviews.getSubstate, `dataviews`, add, actionAddIndex, actionClearIndexes, () => {});

function addMongoView(view) {
	return (dispatch, getState) => {
		let existingView = Select.dataviews.getView(getState(), view._id);
		if (!existingView){
			dispatch(add([{
				key: view._id,
				data: view.conf
			}]))
		}
	}
}

function apiDeleteView(key, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return dispatch => {
		dispatch(actionApiDeleteViewRequest(key));

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/customview/delete');

		let query = queryString.stringify({id: key});
		url += '?' + query;

		return fetch(url, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		}).then(
			response => {
				console.log('#### delete view response', response);
				let contentType = response.headers.get('Content-type');
				if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
					return response.json().then(data => {
						if (data.status === 'Ok'){
							dispatch(actionApiDeleteViewReceive(data));
							dispatch(actionRemove([key]));
						} else {
							dispatch(actionApiDeleteViewRequestError('no data returned'));
						}
					});
				} else {
					dispatch(actionApiDeleteViewRequestError(response))
				}
			},
			error => {
				console.log('#### delete view error', error);
				if (ttl - 1) {
					dispatch(apiDeleteView(key, ttl - 1));
				} else {
					dispatch(actionApiDeleteViewRequestError("views#action delete view: View was not deleted!"));
				}
			}
		);
	};
}

function loadByKey(key) {
	return (dispatch, getState) => {
		let filter = {key: key};
		dispatch(common.loadFiltered('dataviews', filter, add, loadByKeyError)).then(() => {
			dispatch(setActiveKey(key));
			let activeDataview = Select.dataviews.getActive(getState());
			let data = activeDataview && activeDataview.data;

			if (data.dataset){
				dispatch(ScopesActions.loadForKeys([data.dataset]))
					.then(() => {
						dispatch(ScopesActions.setActiveKey(data.dataset));
						let activeScopeConfig = Select.scopes.getActiveScopeConfiguration(getState());

						if (activeScopeConfig && activeScopeConfig.hasOwnProperty(`dromasLpisChangeReview`)){
							dispatch(LpisCasesActions.loadCaseForActiveView()).then(() => {
								dispatch(LpisCasesActions.setActiveCaseByActiveView());
							});
						}

						if ((data.locations && data.locations.length) || (data.location)){
							if (data.locations && data.locations.length > 1){
								dispatch(PlacesActions.setActive(data.locations));
								dispatch(PlacesActions.ensure(data.locations));
							} else {
								dispatch(PlacesActions.setActive(data.location));
								dispatch(PlacesActions.ensure([data.location]));
							}
						} else {
							dispatch(PlacesActions.initializeForExt());
						}
					})
					.catch(error => {
					throw new Error(error);
				});
			}

			if (data.years){
				if (data.years.length > 1){
					dispatch(PeriodsActions.setActiveKeys(data.years));
				} else {
					let year = _.isArray(data.years) ? data.years[0] : data.years;
					dispatch(PeriodsActions.setActiveKey(year));
				}
				dispatch(PeriodsActions.ensure(data.years));
			}

			if (data.theme){
				dispatch(ThemesActions.setActiveKey(data.theme));
				dispatch(ThemesActions.loadByKeys([data.theme]))
					.then(() => {
						let activeTheme = Select.themes.getActive(getState());
						if (activeTheme && activeTheme.data && activeTheme.data.topics) {
							return dispatch(AttributeSetsActions.loadForTopics(activeTheme.data.topics));
						} else {
							throw new Error(`state/dataviews/actions#loadByKey No topics for active theme!`);
						}
					})
					.then(() => {
						let attributeKeys = Select.attributeSets.getAttributeKeysForActive(getState());
						if (attributeKeys){
							dispatch(AttributesActions.ensure(attributeKeys));
						} else {
							dispatch(AttributesActions.initializeForExt());
						}
					})
					.catch(err => {
						throw new Error(err);
					});
			}
		}).catch(err => {
			dispatch(loadByKeyError(err));
		});
	}
}

function ensureForScope(scopeKey, start, length, componentId) {
	return (dispatch) => {
		let getSubstate = Select.dataviews.getSubstate;
		dispatch(common.ensureIndex(getSubstate, 'dataviews', {dataset: scopeKey}, null, start, length, add, actionAddIndex, ensureForScopeError, componentId));
	}
}

function loadByKeyError(data) {
	return dispatch => {
		throw new Error(`state/dataviews/actions#loadByKeyError: ${data}`);
	}
}

function ensureForScopeError(data) {
	return dispatch => {
		throw new Error(`state/dataviews/actions#ensureForScopeError: ${data}`);
	}
}

// ============ actions ===========

function actionRemove(keys) {
	return {
		type: ActionTypes.DATAVIEWS_REMOVE,
		keys: keys
	}
}

function actionApiDeleteViewReceive(data) {
	return {
		type: ActionTypes.DATAVIEWS_DELETE_RECEIVE,
		data: data
	}
}

function actionApiDeleteViewRequest(key) {
	return {
		type: ActionTypes.DATAVIEWS_DELETE_REQUEST,
		key: key
	}
}

function actionApiDeleteViewRequestError(error) {
	return {
		type: ActionTypes.DATAVIEWS_DELETE_REQUEST_ERROR,
		error: error
	}
}

function actionAddIndex(filter, order, count, start, data, changedOn) {
	return {
		type: ActionTypes.DATAVIEWS.INDEX.ADD,
		filter: filter,
		order: order,
		count: count,
		start: start,
		data: data,
		changedOn
	}
}

function registerUseIndexed(componentId, filterByActive, filter, order, start, length) {
	return {
		type: ActionTypes.DATAVIEWS.USE.INDEXED.REGISTER,
		componentId,
		filterByActive,
		filter,
		order,
		start,
		length
	}
}

function actionUseKeysRegister(componentId, keys) {
	return {
		type: ActionTypes.DATAVIEWS.USE.KEYS.REGISTER,
		componentId,
		keys
	}
}

function actionClearUseindexed(componentId) {
	return {
		type: ActionTypes.DATAVIEWS.USE.INDEXED.CLEAR,
		componentId
	}
}

function actionUseKeysClear(componentId) {
	return {
		type: ActionTypes.DATAVIEWS.USE.KEYS.CLEAR,
		componentId
	}
}

function actionClearIndexes() {
	return {
		type: ActionTypes.DATAVIEWS.INDEX.CLEAR_ALL,
	}
}

// ============ export ===========

export default {
	add,
	ensureForScope,
	addMongoView,
	apiDeleteView,
	loadByKey,
	refreshAllIndexes,
	setActiveKey,
	useIndexed,
	useIndexedClear: actionClearUseindexed,
	useKeys,
	useKeysClear: actionUseKeysClear
}
