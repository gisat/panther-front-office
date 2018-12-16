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

const useKeys = (getSubstate, dataType, actionTypes) => {
	return (keys, componentId) => {
		return dispatch => {
			dispatch(actionUseKeysRegister(actionTypes, componentId, keys));
			dispatch(ensureKeys(getSubstate, dataType, actionTypes, keys));
		};
	}
};

const useIndexed = (getSubstate, dataType, actionTypes) => {
	return (filterByActive, filter, order, start, length, componentId) => {
		return (dispatch, getState) => {
			dispatch(actionUseIndexedRegister(actionTypes, componentId, filterByActive, filter, order, start, length));
			let state = getState();
			let fullFilter = commonHelpers.mergeFilters({
				activeScopeKey: commonSelectors.getActiveKey(state => state.scopes)(state),
				activeThemeKey: commonSelectors.getActiveKey(state => state.themes)(state),
				activePeriodKey: commonSelectors.getActiveKey(state => state.periods)(state),
				activePeriodKeys: commonSelectors.getActiveKey(state => state.periods)(state),
				activePlaceKey: commonSelectors.getActiveKey(state => state.places)(state),
				activePlaceKeys: commonSelectors.getActiveKey(state => state.places)(state),
			}, filterByActive, filter);
			dispatch(ensureIndexed(getSubstate, dataType, fullFilter, order, start, length, actionTypes));
		};
	}
};

const setActiveKeyAndEnsureDependencies = (actionTypes, filterKey) => {
	return key => {
		return dispatch => {
			dispatch(actionSetActiveKey(actionTypes, key));
			dispatch(ensureIndexesWithActiveKey(filterKey));
		};
	};
};

function refreshIndex(getSubstate, dataType, filter, order, actionTypes) {
	return (dispatch, getState) => {
		let state = getState();
		let usesForIndex = commonSelectors.getUsesForIndex(getSubstate)(state, filter, order);
		if (usesForIndex){
			_.each(usesForIndex.uses, (use) => {
				dispatch(ensureIndexed(getSubstate, dataType, usesForIndex.filter, usesForIndex.order, use.start, use.length, actionTypes))
			});
		}
	}
}

function receiveIndexed(actionTypes, result, dataType, filter, order, start) {
		return dispatch => {
			// add data to store
			if (result.data[dataType].length){
				dispatch(actionAdd(actionTypes, result.data[dataType]));
			}

			// add to index
			dispatch(actionAddIndex(actionTypes, filter, order, result.total, start, result.data[dataType], result.changes[dataType]));
		}
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

function loadAll(dataType, actionTypes) {
	return dispatch => {
		let apiPath = path.join('backend/rest/metadata/filtered', dataType);
		let payload = {
			limit: PAGE_SIZE
		};
		request(apiPath, 'POST', null, payload)
			.then(result => {
				if (result.errors && result.errors[dataType] || result.data && !result.data[dataType]) {
					dispatch(actionGeneralError(result.errors[dataType] || new Error('no data')));
				} else {
					if (result.total <= PAGE_SIZE) {
						// everything already loaded
						dispatch(actionAdd(actionTypes, result.data[dataType]));
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
							dispatch(actionAdd(actionTypes, [...result.data[dataType], ...remainingData]));
						});
					}
				}

			})
			.catch(error => {
				dispatch(actionGeneralError(error));
			});
	};
}

function ensureKeys(getSubstate, dataType, actionTypes, keys){
	return (dispatch, getState) => {
		let state = getState();

		let keysToLoad = commonSelectors.getKeysToLoad(getSubstate)(state, keys);
		if (keysToLoad){
			keysToLoad = _.chunk(keysToLoad, PAGE_SIZE);
			_.each(keysToLoad, keysToLoadPage => {
				dispatch(loadKeysPage(dataType, actionTypes, keysToLoadPage));
			});
		}
	}
}

function ensureIndexed(getSubstate, dataType, filter, order, start, length, actionTypes){
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
					dispatch(loadIndexedPage(dataType, completeFilter, order, start + i, changedOn, actionTypes))
						.catch((err) => {
							if (err.message === 'Index outdated'){
								dispatch(refreshIndex(getSubstate, dataType, filter, order, actionTypes));
							}
						});
				}
			}

			return Promise.resolve();
		} else {
			// we don't have index
			return dispatch(loadIndexedPage(dataType, filter, order, start, changedOn, actionTypes)).then((response) => {
				if (response && response.message){
					// do nothing
				} else {
					dispatch(ensureIndexed(getSubstate, dataType, filter, order, start + PAGE_SIZE, length - PAGE_SIZE, actionTypes));
				}
			}).catch((err)=>{
				if (err.message === 'Index outdated'){
					dispatch(refreshIndex(getSubstate, dataType, filter, order, actionTypes));
				} else {
					throw new Error(`_common/actions#ensure: ${err}`);
				}
			});
		}
	};
}

function loadKeysPage(dataType, actionTypes, keys) {
	return dispatch => {
		let apiPath = path.join('backend/rest/metadata/filtered', dataType);

		let payload = {
			filter: {
				key: {
					in: keys
				}
			}
		};
		return request(apiPath, 'POST', null, payload)
			.then(result => {
				if (result.errors && result.errors[dataType] || result.data && !result.data[dataType]) {
					dispatch(actionGeneralError(result.errors[dataType] || new Error('no data')));
					throw new Error(result.errors[dataType] || 'no data');
				} else {
					dispatch(receiveKeys(actionTypes, result, dataType, keys));
				}
			})
			.catch(error => {
				dispatch(actionGeneralError(error));
				return error;
			});
	}
}

function loadIndexedPage(dataType, filter, order, start, changedOn, actionTypes) {
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
					dispatch(actionGeneralError(result.errors[dataType] || new Error('no data')));
					throw new Error(result.errors[dataType] || 'no data');
				} else if (result.changes && result.changes[dataType] && moment(result.changes[dataType]).isAfter(changedOn)) {
					throw new Error('Index outdated');
				} else {
					dispatch(receiveIndexed(actionTypes, result, dataType, filter, order, start));
				}
			})
			.catch(error => {
				dispatch(actionGeneralError(error));
				return error;
			});
	};
}

function loadFiltered(dataType, actionTypes, filter) {
	return dispatch => {
		let apiPath = path.join('backend/rest/metadata/filtered', dataType);
		let payload = {
			filter: filter,
			limit: PAGE_SIZE
		};
		return request(apiPath, 'POST', null, payload)
			.then(result => {
				if (result.errors && result.errors[dataType] || result.data && !result.data[dataType]) {
					dispatch(actionGeneralError(result.errors[dataType] || new Error('no data')));
				} else {
					if (result.total <= PAGE_SIZE) {
						// everything already loaded
						return dispatch(actionAdd(actionTypes, result.data[dataType]));
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
							dispatch(actionAdd(actionTypes, [...result.data[dataType], ...remainingData]));
						});
					}
				}

			})
			.catch(error => {
				dispatch(actionGeneralError(error));
			});
	};
}

function receiveKeys(actionTypes, result, dataType, keys) {
	return dispatch => {
		// add data to store
		if (result.data[dataType].length){
			dispatch(actionAdd(actionTypes, result.data[dataType]));
		}

		// add unreceived keys
		_.remove(keys, key => {
			return _.find(result.data[dataType], {key});
		});
		if (keys.length) {
			dispatch(actionAddUnreceivedKeys(actionTypes, keys));
		}
	}
}

function refreshAllIndexes(getSubstate, dataType, actionTypes) {
	return () => {
		return(dispatch, getState) => {
			dispatch(actionClearIndexes(actionTypes));

			let state = getState();

			let usedKeys = commonSelectors.getUsedKeys(getSubstate)(state);
			dispatch(ensureKeys(getSubstate, dataType, actionTypes, usedKeys));

			let usedIndexPages = commonSelectors.getUsedIndexPages(getSubstate)(state);

			_.each(usedIndexPages, (usedIndexPage) => {
				_.each(usedIndexPage.uses, (use) => {
					dispatch(ensureIndexed(getSubstate, dataType, usedIndexPage.filter, usedIndexPage.order, use.start, use.length, actionTypes))
				});
			})
		}
	}
}

function ensureIndexesWithFilterByActive(getSubstate, dataType, actionTypes) {
	return filterByActive => {
		return (dispatch, getState) => {

			let state = getState();
			let usedIndexes = commonSelectors.getUsesWithActiveDependency(getSubstate)(state, filterByActive);

			_.each(usedIndexes, (usedIndex) => {
				_.each(usedIndex.uses, (use) => {
					dispatch(ensureIndexed(getSubstate, dataType, usedIndex.filter, usedIndex.order, use.start, use.length, actionTypes))
				});
			})

		}
	}
}

function ensureIndexesWithActiveKey(filterKey) {
		return dispatch => {

			let filterByActive = {
				[filterKey]: true
			};

			let actions = [
				ensureIndexesWithFilterByActive(Select.dataviews.getSubstate, 'dataviews', ActionTypes.DATAVIEWS),
				ensureIndexesWithFilterByActive(Select.places.getSubstate, 'places', ActionTypes.PLACES),
				ensureIndexesWithFilterByActive(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS),
			];

			_.each(actions, action => dispatch(action(filterByActive)));

		};
}

// ============ common namespace actions ===========

function actionDataSetOutdated() {
	return {
		type: ActionTypes.COMMON.DATA.SET_OUTDATED
	}
}

function actionGeneralError(e) {
	console.error('common/actions error', e);
	return {type: 'ERROR'};
}

// ============ specific store namespace actions ===========

const creator = (action) => {
	return (actionTypes) => {
		return (...args) => {
			return dispatch => {
				dispatch(action(actionTypes, ...args));
			};
		};
	};
};

function action(actionTypes, type, payload) {
	type = type.split('.');
	_.each(type, pathSegment => {
		if (!actionTypes.hasOwnProperty(pathSegment)) {
			console.error('common/actions#action: Action not in namespace', type, payload);
			throw new Error('common/actions#action: Action not in namespace');
		}
		actionTypes = actionTypes[pathSegment];
	});
	if (typeof actionTypes !== 'string') throw new Error('common/actions#action: Action type not string');
	return {...payload, type: actionTypes};
}

function actionAdd(actionTypes, data) {
	if (!_.isArray(data)) data = [data];
	return action(actionTypes, 'ADD', {data});
}

function actionAddUnreceivedKeys(actionTypes, keys) {
	if (!_.isArray(keys)) keys = [keys];
	return action(actionTypes, 'ADD_UNRECEIVED', {keys});
}

function actionAddIndex(actionTypes, filter, order, count, start, data, changedOn) {
	return action(actionTypes, 'INDEX.ADD', {filter, order, count, start, data, changedOn});
}

function actionClearIndexes(actionTypes) {
	return action(actionTypes, 'INDEX.CLEAR_ALL');
}

function actionSetActiveKey(actionTypes, key) {
	return action(actionTypes, 'SET_ACTIVE_KEY', {key});
}

function actionSetActiveKeys(actionTypes, keys) {
	return action(actionTypes, 'SET_ACTIVE_KEYS', {keys});
}

function actionUseIndexedRegister(actionTypes, componentId, filterByActive, filter, order, start, length) {
	return action(actionTypes, 'USE.INDEXED.REGISTER', {componentId, filterByActive, filter, order, start, length});
}

function actionUseKeysRegister(actionTypes, componentId, keys) {
	return action(actionTypes, 'USE.KEYS.REGISTER', {componentId, keys});
}

// ============ export ===========

export default {
	add: creator(actionAdd),
	action,
	actionAdd,
	creator,
	ensure: ensureKeys,
	ensureIndex: ensureIndexed,
	loadAll,
	loadFiltered,
	loadKeysPage,
	setActiveKey: creator(actionSetActiveKey),
	setActiveKeyAndEnsureDependencies,
	setActiveKeys: creator(actionSetActiveKeys),
	refreshAllIndexes,
	request: requestWrapper,
	useKeys,
	useIndexed,

	actionDataSetOutdated,
	actionSetActiveKey
}
