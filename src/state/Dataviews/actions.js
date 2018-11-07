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
import ScopesActions from "../Scopes/actions";
import PeriodsActions from "../Periods/actions";
import PlacesActions from "../Places/actions";
import ThemesActions from "../_Themes/actions";

import common from "../_common/actions";

const TTL = 5;

// ============ creators ===========

const add = common.add(actionAdd);
const setActiveKey = common.setActiveKey(actionSetActiveKey);
const useIndexed = common.useIndexed(Select.dataviews.getSubstate, 'dataviews', actionAdd, actionAddIndex, ensureForScopeError, registerUseIndexed);

function addMongoView(view) {
	return (dispatch, getState) => {
		let existingView = Select.dataviews.getView(getState(), view._id);
		if (!existingView){
			dispatch(actionAdd([{
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
				dispatch(ScopesActions.setActiveKey(data.dataset));
				dispatch(ScopesActions.ensure([data.dataset]));
			}

			if (data.locations || data.location){
				if (data.locations && data.locations.length > 1){
					dispatch(PlacesActions.setActiveKeys(data.locations));
					dispatch(PlacesActions.ensure(data.locations));
				} else {
					dispatch(PlacesActions.setActiveKey(data.location));
					dispatch(PlacesActions.ensure([data.location]));
				}
			}

			if (data.years){
				if (data.years && data.years.length === 1){
					dispatch(PeriodsActions.setActiveKey(data.years[0]));
				} else {
					dispatch(PeriodsActions.setActiveKeys(data.years));
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
							dispatch(AttributesActions.loadForKeys(attributeKeys));
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
		dispatch(common.ensureIndex(getSubstate, 'dataviews', {dataset: scopeKey}, null, start, length, actionAdd, actionAddIndex, ensureForScopeError, componentId));
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

function actionAdd(views) {
	return {
		type: ActionTypes.DATAVIEWS.ADD,
		data: views
	}
}

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

function actionSetActiveKey(key) {
	return {
		type: ActionTypes.DATAVIEWS.SET_ACTIVE_KEY,
		key: key
	}
}

function actionAddIndex(filter, order, count, start, data) {
	return {
		type: ActionTypes.DATAVIEWS.INDEX.ADD,
		filter: filter,
		order: order,
		count: count,
		start: start,
		data: data
	}
}

function registerUseIndexed(componentId, filter, order, start, length) {
	return {
		type: ActionTypes.DATAVIEWS.USE.INDEXED.REGISTER,
		componentId,
		filter,
		order,
		start,
		length
	}
}

function actionClearUseindexed(componentId) {
	return {
		type: ActionTypes.DATAVIEWS.USE.INDEXED.CLEAR,
		componentId
	}
}

// ============ export ===========

export default {
	add,
	ensureForScope,
	addMongoView,
	apiDeleteView,
	loadByKey,
	setActiveKey,
	useIndexed,
	useIndexedClear: actionClearUseindexed
}
