import _ from "lodash";
import config from "../../config";
import queryString from "query-string";
import path from "path";
import fetch from "isomorphic-fetch";

import commonSelectors from './selectors';

const TTL = 5;
const PAGE_SIZE = 10;

const add = (action) => {
	return (data) => {
		return dispatch => {
			if (!_.isArray(data)) data = [data];
			dispatch(action(data));
		};
	}
};

const addIndex = (action) => {
	return (filter, order, count, start, data) => {
		return dispatch => {
			dispatch(action(filter, order, count, start, data));
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

function receive(actionAdd, actionAddIndex) {
	return (data, dataType, filter, order, start) => {
		return dispatch => {
			// add data to store
			if (data.data[dataType].length){
				dispatch(add(actionAdd)(data.data[dataType]));
			}

			// todo check index - create or clear if needed
			dispatch(addIndex(actionAddIndex)(filter, order, data.total, start, data.data[dataType]));

			// todo check index - create or clear if needed
			// todo add data to index
		}
	};
}

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

function ensure(getSubstate, dataType, filter, actionAdd, errorAction){
	return (dispatch, getState) => {
		let state = getState();

		// todo commonSelectors.getFiltered
		let alreadyLoaded = commonSelectors.getByKey(getSubstate)(state, filter.key);
		if (!alreadyLoaded){
			dispatch(loadFiltered(dataType, filter, actionAdd, errorAction));
		}
	}
}

function ensureIndex(getSubstate, dataType, filter, order, start, length, actionAdd, actionAddIndex, errorAction){
	return (dispatch, getState) => {
		let state = getState();
		let total = commonSelectors.getIndexTotal(getSubstate)(state, filter, order);

		if (total || total === 0){
			let indexPage = commonSelectors.getIndexPage(getSubstate)(state, filter, order, start, length);
			let amount = Object.keys(indexPage).length;
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
					dispatch(loadFilteredPage(dataType, completeFilter, order, start + i, actionAdd, actionAddIndex, errorAction));
				}
			}

			return Promise.resolve();
		} else {
			// we don't have index
			return dispatch(loadFilteredPage(dataType, filter, order, start, actionAdd, actionAddIndex, errorAction)).then((response) => {
				if (response && response.message){
					// do nothing
				} else {
					dispatch(ensureIndex(getSubstate, dataType, filter, order, start + PAGE_SIZE, length - PAGE_SIZE, actionAdd, actionAddIndex, errorAction));
				}
			}).catch((err)=>{
				throw new Error(`_common/actions#ensure: ${err}`);
			});
		}
	};
}

function loadFilteredPage(dataType, filter, order, start, actionAdd, actionAddIndex, errorAction) {
	return dispatch => {
		let apiPath = path.join('backend/rest/metadata/filtered', dataType);

		let payload = {
			filter: {...filter},
			offset: start -1,
			limit: PAGE_SIZE
		};
		return request(apiPath, 'POST', null, payload)
			.then(result => {
				if (result.errors && result.errors[dataType] || result.data && !result.data[dataType]) {
					dispatch(errorAction(result.errors[dataType] || new Error('no data')));
					throw new Error(result.errors[dataType] || 'no data');
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
			filter: {...filter},
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
								filter: {...filter},
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

export default {
	add,
	ensure,
	ensureIndex,
	loadAll,
	loadFiltered,
	setActiveKey,
	setActiveKeys,
	request: requestWrapper
}
