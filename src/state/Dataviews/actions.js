import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import fetch from "isomorphic-fetch";
import config from "../../config";
import path from "path";
import queryString from 'query-string';
import Dataview from "../../data/Dataview";
import Select from "../Select";

import common from "../_common/actions";
import Action from "../Action";

const TTL = 5;

// ============ creators ===========

const add = common.add(ActionTypes.DATAVIEWS);
const setActiveKey = common.setActiveKey(ActionTypes.DATAVIEWS);
const useIndexed = common.useIndexed(Select.dataviews.getSubstate, 'dataviews', ActionTypes.DATAVIEWS);
const useKeys = common.useKeys(Select.dataviews.getSubstate, `dataviews`, ActionTypes.DATAVIEWS);
const refreshAllIndexes = common.refreshAllIndexes(Select.dataviews.getSubstate, `dataviews`, ActionTypes.DATAVIEWS);

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

function loadActive() {
	return (dispatch, getState) => {
		let key = Select.dataviews.getActiveKey(getState());
		dispatch(common.loadKeysPage('dataviews', ActionTypes.DATAVIEWS, [key])).then(() => {
			let activeDataview = Select.dataviews.getActive(getState());
			if (activeDataview && activeDataview.data){
				dispatch(initialMetadataLoad());
			}
		}).catch(err => {
			dispatch(loadByKeyError(err));
		});
	}
}

function initialMetadataLoad (){
	return (dispatch, getState) => {
		let activeDataview = Select.dataviews.getActive(getState());
		let data = activeDataview && activeDataview.data;

		if (data.dataset){
			dispatch(Action.scopes.loadForKeys([data.dataset]))
				.then(() => {
					dispatch(Action.scopes.setActiveKey(data.dataset));
					let activeScopeConfig = Select.scopes.getActiveScopeConfiguration(getState());

					if (activeScopeConfig && activeScopeConfig.hasOwnProperty(`dromasLpisChangeReview`)){
						dispatch(Action.lpisCases.loadCaseForActiveView()).then(() => {
							dispatch(Action.lpisCases.setActiveCaseByActiveView());
						});
					}

					if ((data.locations && data.locations.length) || (data.location)){
						if (data.locations && data.locations.length > 1){
							dispatch(Action.places.setActive(data.locations));
							dispatch(Action.places.useKeys(data.locations, 'ActiveView'));
						} else {
							dispatch(Action.places.setActive(data.location));
							dispatch(Action.places.useKeys([data.location], 'ActiveView'));
						}
					} else {
						dispatch(Action.places.initializeForExt());
					}
				})
				.catch(error => {
					throw new Error(error);
				});
		}

		if (data.years){
			if (data.years.length > 1){
				dispatch(Action.periods.setActiveKeys(data.years));
			} else {
				let year = _.isArray(data.years) ? data.years[0] : data.years;
				dispatch(Action.periods.setActiveKey(year));
			}
			dispatch(Action.periods.useKeys(data.years, 'ActiveView'));
		}

		if (data.theme){
			dispatch(Action.themes.setActiveKey(data.theme));
			dispatch(Action.themes.loadByKeys([data.theme]))
				.then(() => {
					let activeTheme = Select.themes.getActive(getState());
					if (activeTheme && activeTheme.data && activeTheme.data.topics) {
						return dispatch(Action.attributeSets.loadForTopics(activeTheme.data.topics));
					} else {
						throw new Error(`state/dataviews/actions#loadByKey No topics for active theme!`);
					}
				})
				.then(() => {
					let topics = Select.themes.getTopicsForActive(getState());
					let attributeKeys = Select.attributeSets.getUniqueAttributeKeysForTopics(getState(), topics);
					if (attributeKeys){
						dispatch(Action.attributes.useKeys(attributeKeys, 'ActiveView'));
					} else {
						dispatch(Action.attributes.initializeForExt());
					}
				})
				.catch(err => {
					throw new Error(err);
				});
		}
	}
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
	addMongoView,
	apiDeleteView,
	loadActive,
	refreshAllIndexes,
	setActiveKey,
	useIndexed,
	useIndexedClear: actionClearUseindexed,
	useKeys,
	useKeysClear: actionUseKeysClear
}
