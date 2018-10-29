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

function receive(actionAdd, getSubstate) {
	return (data, filter, order, start, length) => {
		return dispatch => {
			// add data to store
			dispatch(add(actionAdd)(data));
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

function ensure(getSubstate, dataType, filter, order, start, length, successAction, errorAction){
	return (dispatch, getState) => {
		let state = getState();
		let total = commonSelectors.getIndexTotal(getSubstate)(state, filter, order);

		if (total){
			let indexPage = commonSelectors.getIndexPage(getSubstate)(state, filter, order, start, length);
			let amount = Object.keys(index).length;
			for (let i = 0; i < amount; i += PAGE_SIZE){
				let loadedKeys = [], requestNeeded = false;
				for (let j = 0; j < PAGE_SIZE; j++){
					if (indexPage[start + i + j]){
						loadedKeys.push(indexPage[start + i + j]);
					} else {
						requestNeeded = true;
					}
				}
				if (requestNeeded){
					let completeFilter = loadedKeys ? {...filter, key: {notin: loadedKeys}} : filter;
					dispatch(loadFilteredPage(dataType, completeFilter, order, start + i, successAction, errorAction));
				}
			}
		} else {
			// we don't have index
			dispatch(loadFilteredPage(dataType, filter, order, start, successAction, errorAction)).then(() => {
				dispatch(ensure(getSubstate, dataType, filter, order, start + PAGE_SIZE, length - PAGE_SIZE, successAction, errorAction));
			});
		}
	};
}

function loadFilteredPage(dataType, filter, order, start, successAction, errorAction) {
	return dispatch => {
		let apiPath = path.join('backend/rest/metadata/filtered', dataType);

		let payload = {
			...filter,
			offset: start -1,
			limit: PAGE_SIZE
		};
		return request(apiPath, 'POST', null, payload)
			.then(result => {
				dispatch(successAction(result));
				// todo pass index info
			})
			.catch(error => {
				dispatch(errorAction(error));
			});
	};
}

function loadFiltered(dataType, filter, order, successAction, errorAction) {
	return dispatch => {
		let apiPath = path.join('backend/rest/metadata/filtered', dataType);
		let payload = {
			...filter,
			order,
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
								...filter,
								order,
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

export default {
	add,
	ensure,
	loadAll,
	setActiveKey,
	setActiveKeys,
	request: requestWrapper
}
