import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import fetch from "isomorphic-fetch";
import config from "../../config";
import path from "path";
import queryString from 'query-string';
import Dataview from "../../data/Dataview";
import Select from "../Select";
import ScopeActions from "../Scopes/actions";
import PlaceActions from "../Places/actions";

import common from "../_common/actions";

const TTL = 5;

// ============ creators ===========

const add = common.add(actionAdd);
const setActiveKey = common.setActiveKey(actionSetActiveKey);

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
		dispatch(common.loadFiltered('dataviews', [key], add, loadByKeyError)).then(() => {
			dispatch(setActiveKey(key));
			let activeDataview = Select.dataviews.getActive(getState());
			let data = activeDataview && activeDataview.data;

			if (data.dataset){
				dispatch(ScopeActions.setActiveKey(data.dataset));
				dispatch(ScopeActions.ensure([data.dataset]));
			}
		}).catch(err => {
			dispatch(loadByKeyError(err));
		});
	}
}

function ensureForScope(scopeKey, start, length) {
	return (dispatch) => {
		let getSubstate = Select.dataviews.getSubstate;
		dispatch(common.ensureIndex(getSubstate, 'dataviews', {dataset: scopeKey}, null, start, length, actionAdd, actionAddIndex, ensureForScopeError));
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

// ============ export ===========

export default {
	add,
	ensureForScope,
	addMongoView,
	apiDeleteView,
	loadByKey,
	setActiveKey
}
