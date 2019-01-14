import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import fetch from "isomorphic-fetch";
import config from "../../config";
import path from "path";
import queryString from 'query-string';
import Select from "../Select";

import common from "../_common/actions";
import Action from "../Action";

const TTL = 5;

// ============ creators ===========

const add = common.add(ActionTypes.DATAVIEWS);
const setActiveKey = common.setActiveKey(ActionTypes.DATAVIEWS);
const useIndexed = common.useIndexed(Select.dataviews.getSubstate, 'dataviews', ActionTypes.DATAVIEWS);
const useKeys = common.useKeys(Select.dataviews.getSubstate, `dataviews`, ActionTypes.DATAVIEWS);
const refreshUses = common.refreshUses(Select.dataviews.getSubstate, `dataviews`, ActionTypes.DATAVIEWS);
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.dataviews.getSubstate, 'dataviews', ActionTypes.DATAVIEWS);
const receiveIndexed = (result, filter, order, start) => common.receiveIndexed(ActionTypes.DATAVIEWS, result, 'dataviews', filter, order, start);

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

function loadByKeyError(data) {
	return dispatch => {
		throw new Error(`state/dataviews/actions#loadByKeyError: ${data}`);
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

// ============ export ===========

export default {
	add,
	apiDeleteView,
	ensureIndexesWithFilterByActive,
	receiveIndexed,
	refreshUses,
	setActiveKey,
	useIndexed,
	useIndexedClear: actionClearUseindexed,
	useKeys,
	useKeysClear: actionUseKeysClear
}
