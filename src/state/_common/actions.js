import _ from "lodash";
import config from "../../config";
import queryString from "query-string";
import path from "path";
import fetch from "isomorphic-fetch";
import moment from 'moment';

import commonHelpers from './helpers';
import commonSelectors from './selectors';
import Select from "../Select";
import ActionTypes from "../../constants/ActionTypes";

const TTL = 5;
const PAGE_SIZE = 10;

// ============ helpers =============
/**
 * Request helper. Creates an request to backend.
 * @param apiPath - path to backend endpoint (hostname taken from config)
 * @param method - HTTP method
 * @param query - url query as object
 * @param payload - payload as object
 * @param ttl - (optional) number of tries
 * @returns response or error
 */
function request(apiPath, method, query, payload, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, apiPath);
	if (query) {
		url += '?' + queryString.stringify(query);
	}

	return fetch(url, {
		method: method,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: payload ? JSON.stringify(payload) : null
	}).then(
		response => {
			let contentType = response.headers.get('Content-type');
			if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
				return response.json().then(body => {
					if (body.data) {
						return body;
					} else {
						throw new Error('no data returned');
					}
				});
			} else {
				throw new Error('response error');
			}
		},
		error => {
			if (ttl - 1) {
				request(apiPath, method, query, payload, ttl - 1);
			} else {
				throw error;
			}
		}
	);

}

// ============ factories ===========

const add = (action) => {
	return (data) => {
		return dispatch => {
			if (!_.isArray(data)) data = [data];
			dispatch(action(data));
		};
	}
};

const addIndex = (action) => {
	return (filter, order, count, start, data, changedOn) => {
		return dispatch => {
			dispatch(action(filter, order, count, start, data, changedOn));
		};
	}
};

const setActiveKey = (action) => {
	return (key) => {
		return dispatch => {
			dispatch(action(key));
		};
	}
};

const setActiveKeys = (action) => {
	return (keys) => {
		return dispatch => {
			dispatch(action(keys));
		};
	}
};

const useKeys = (getSubstate, dataType, actionAdd, errorAction, registerUseKeys) => {
	return (keys, componentId) => {
		return dispatch => {
			dispatch(registerUseKeys(componentId, keys));
			dispatch(ensure(getSubstate, dataType, actionAdd, errorAction, keys));
		};
	}
};

const useIndexed = (getSubstate, dataType, actionAdd, actionAddIndex, errorAction, registerUseIndexed) => {
	return (filterByActive, filter, order, start, length, componentId) => {
		return (dispatch, getState) => {
			dispatch(registerUseIndexed(componentId, filterByActive, filter, order, start, length));
			let state = getState();
			let fullFilter = commonHelpers.mergeFilters({
				activeScopeKey: commonSelectors.getActiveKey(state => state.scopes)(state),
				activeThemeKey: commonSelectors.getActiveKey(state => state.themes)(state),
				activePeriodKey: commonSelectors.getActiveKey(state => state.periods)(state),
				activePeriodKeys: commonSelectors.getActiveKey(state => state.periods)(state),
				activePlaceKey: commonSelectors.getActiveKey(state => state.places)(state),
				activePlaceKeys: commonSelectors.getActiveKey(state => state.places)(state),
			}, filterByActive, filter);
			dispatch(ensureIndex(getSubstate, dataType, fullFilter, order, start, length, actionAdd, actionAddIndex, errorAction));
		};
	}
};

function refreshIndex(getSubstate, dataType, filter, order, actionAdd, actionAddIndex, errorAction) {
	return (dispatch, getState) => {
		let state = getState();
		let usesForIndex = commonSelectors.getUsesForIndex(getSubstate)(state, filter, order);
		if (usesForIndex){
			_.each(usesForIndex.uses, (use) => {
				dispatch(ensureIndex(getSubstate, dataType, usesForIndex.filter, usesForIndex.order, use.start, use.length, actionAdd, actionAddIndex, errorAction))
			});
		}
	}
}

function receive(actionAdd, actionAddIndex) {
	return (result, dataType, filter, order, start) => {
		return dispatch => {
			// add data to store
			if (result.data[dataType].length){
				dispatch(add(actionAdd)(result.data[dataType]));
			}

			// todo check index - create or clear if needed
			dispatch(addIndex(actionAddIndex)(filter, order, result.total, start, result.data[dataType], result.changes[dataType]));

			// todo check index - create or clear if needed
			// todo add data to index
		}
	};
}

function requestWrapper(apiPath, method, query, payload, successAction, errorAction) {
	return dispatch => {
		request(apiPath, method, query, payload)
			.then(result => {
				dispatch(successAction(result.data));
			})
			.catch(error => {
				dispatch(errorAction(error));
			});
	}
}

function loadAll(dataType, successAction, errorAction) {
	return dispatch => {
		let apiPath = path.join('backend/rest/metadata/filtered', dataType);
		let payload = {
			limit: PAGE_SIZE
		};
		request(apiPath, 'POST', null, payload)
			.then(result => {
				if (result.errors && result.errors[dataType] || result.data && !result.data[dataType]) {
					dispatch(errorAction(result.errors[dataType] || new Error('no data')));
				} else {
					if (result.total <= PAGE_SIZE) {
						// everything already loaded
						dispatch(successAction(result.data[dataType]));
					} else {
						// load remaining pages
						let promises = [];
						let remainingPageCount = Math.ceil((result.total - PAGE_SIZE) / PAGE_SIZE);
						for (let i = 0; i < remainingPageCount; i++) {
							let pagePayload = {
								offset: (i + 1) * PAGE_SIZE,
								limit: PAGE_SIZE
							};
							promises.push(request(apiPath, 'POST', null, pagePayload)); //todo what if one fails?
						}
						Promise.all(promises).then(results => {
							let remainingData = _.flatten(results.map(res => res.data[dataType]));
							dispatch(successAction([...result.data[dataType], ...remainingData]));
						});
					}
				}

			})
			.catch(error => {
				dispatch(errorAction(error));
			});
	};
}

function ensure(getSubstate, dataType, actionAdd, errorAction, keys){
	return (dispatch, getState) => {
		let state = getState();

		let keysToLoad = commonSelectors.getKeysToLoad(getSubstate)(state, keys);
		if (keysToLoad){
			let filter = {
				key: {
					in: keysToLoad
				}
			};
			return dispatch(loadFiltered(dataType, filter, actionAdd, errorAction));
		}
	}
}

function ensureIndex(getSubstate, dataType, filter, order, start, length, actionAdd, actionAddIndex, errorAction){
	return (dispatch, getState) => {
		let state = getState();
		let total = commonSelectors.getIndexTotal(getSubstate)(state, filter, order);
		let changedOn = commonSelectors.getIndexChangedOn(getSubstate)(state, filter, order);

		if (total || total === 0){
			let indexPage = commonSelectors.getIndexPage(getSubstate)(state, filter, order, start, length);
			let amount = indexPage ? Object.keys(indexPage).length : 0;
			for (let i = 0; i < amount; i += PAGE_SIZE){
				let loadedKeys = [], requestNeeded = false;
				for (let j = 0; j < PAGE_SIZE && (start+i+j) <= total; j++){
					if (indexPage[start + i + j]){
						loadedKeys.push(indexPage[start + i + j]);
					} else {
						requestNeeded = true;
					}
				}
				if (requestNeeded){
					let completeFilter = loadedKeys.length ? {...filter, key: {notin: loadedKeys}} : filter;
					dispatch(loadFilteredPage(dataType, completeFilter, order, start + i, changedOn, actionAdd, actionAddIndex, errorAction))
						.catch((err) => {
							if (err.message === 'Index outdated'){
								dispatch(refreshIndex(getSubstate, dataType, filter, order, actionAdd, actionAddIndex, errorAction));
							}
						});
				}
			}

			return Promise.resolve();
		} else {
			// we don't have index
			return dispatch(loadFilteredPage(dataType, filter, order, start, changedOn, actionAdd, actionAddIndex, errorAction)).then((response) => {
				if (response && response.message){
					// do nothing
				} else {
					dispatch(ensureIndex(getSubstate, dataType, filter, order, start + PAGE_SIZE, length - PAGE_SIZE, actionAdd, actionAddIndex, errorAction));
				}
			}).catch((err)=>{
				if (err.message === 'Index outdated'){
					dispatch(refreshIndex(getSubstate, dataType, filter, order, actionAdd, actionAddIndex, errorAction));
				} else {
					throw new Error(`_common/actions#ensure: ${err}`);
				}
			});
		}
	};
}

function loadFilteredPage(dataType, filter, order, start, changedOn, actionAdd, actionAddIndex, errorAction) {
	return dispatch => {
		let apiPath = path.join('backend/rest/metadata/filtered', dataType);

		let payload = {
			filter: {...filter},
			offset: start -1,
			order: order,
			limit: PAGE_SIZE
		};
		return request(apiPath, 'POST', null, payload)
			.then(result => {
				if (result.errors && result.errors[dataType] || result.data && !result.data[dataType]) {
					dispatch(errorAction(result.errors[dataType] || new Error('no data')));
					throw new Error(result.errors[dataType] || 'no data');
				} else if (result.changes && result.changes[dataType] && moment(result.changes[dataType]).isAfter(changedOn)) {
					throw new Error('Index outdated');
				} else {
					dispatch(receive(actionAdd, actionAddIndex)(result, dataType, filter, order, start));
				}
			})
			.catch(error => {
				dispatch(errorAction(error));
				return error;
			});
	};
}

function loadFiltered(dataType, filter, successAction, errorAction) {
	return dispatch => {
		let apiPath = path.join('backend/rest/metadata/filtered', dataType);
		let payload = {
			filter: filter,
			limit: PAGE_SIZE
		};
		return request(apiPath, 'POST', null, payload)
			.then(result => {
				if (result.errors && result.errors[dataType] || result.data && !result.data[dataType]) {
					dispatch(errorAction(result.errors[dataType] || new Error('no data')));
				} else {
					if (result.total <= PAGE_SIZE) {
						// everything already loaded
						return dispatch(successAction(result.data[dataType]));
					} else {
						// load remaining pages
						let promises = [];
						let remainingPageCount = Math.ceil((result.total - PAGE_SIZE) / PAGE_SIZE);
						for (let i = 0; i < remainingPageCount; i++) {
							let pagePayload = {
								filter: filter,
								offset: (i + 1) * PAGE_SIZE,
								limit: PAGE_SIZE
							};
							promises.push(request(apiPath, 'POST', null, pagePayload)); //todo what if one fails?
						}
						return Promise.all(promises).then(results => {
							let remainingData = _.flatten(results.map(res => res.data[dataType]));
							dispatch(successAction([...result.data[dataType], ...remainingData]));
						});
					}
				}

			})
			.catch(error => {
				dispatch(errorAction(error));
			});
	};
}

function refreshAllIndexes(getSubstate, dataType, actionAdd, actionAddIndex, actionClearIndexes, errorAction) {
	return () => {
		return(dispatch, getState) => {
			dispatch(actionClearIndexes());

			let state = getState();

			let usedKeys = commonSelectors.getUsedKeys(getSubstate)(state);
			dispatch(ensure(getSubstate, dataType, actionAdd, errorAction, usedKeys));

			let usedIndexPages = commonSelectors.getUsedIndexPages(getSubstate)(state);

			_.each(usedIndexPages, (usedIndexPage) => {
				_.each(usedIndexPage.uses, (use) => {
					dispatch(ensureIndex(getSubstate, dataType, usedIndexPage.filter, usedIndexPage.order, use.start, use.length, actionAdd, actionAddIndex, errorAction))
				});
			})
		}
	}
}

// ============ common namespace actions ===========

function actionDataSetOutdated() {
	return {
		type: ActionTypes.COMMON.DATA.SET_OUTDATED
	}
}

// ============ specific store namespace actions ===========

function action(actionTypes, type, payload) {
	type = type.split('.');
	_.each(type, pathSegment => {
		if (!actionTypes.hasOwnProperty(pathSegment)) throw new Error('common/actions#action: Action not in namespace');
		actionTypes = actionTypes[pathSegment];
	});
	if (typeof actionTypes !== 'string') throw new Error('common/actions#action: Action type not string');
	return {...payload, type: actionTypes};
}

function actionAdd(actionTypes, data) {
	if (!_.isArray(data)) data = [data];
	return action(actionTypes, 'ADD', {data});
}

function actionAddIndex(actionTypes, filter, order, count, start, data, changedOn) {
	return action(actionTypes, 'INDEX.ADD', {filter, order, count, start, data, changedOn});
}

// ============ export ===========

export default {
	add,
	ensure,
	ensureIndex,
	loadAll,
	loadFiltered,
	setActiveKey,
	setActiveKeys,
	refreshAllIndexes,
	request: requestWrapper,
	useKeys,
	useIndexed,
	actionDataSetOutdated
}
