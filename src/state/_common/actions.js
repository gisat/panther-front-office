import _ from "lodash";
import config from "../../config";
import queryString from "query-string";
import path from "path";
import fetch from "isomorphic-fetch";

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
						return new Error('no data returned');
					}
				});
			} else {
				return new Error('response error'); //todo return or throw errors?
			}
		},
		error => {
			if (ttl - 1) {
				request(apiPath, method, query, payload, ttl - 1);
			} else {
				return error;
			}
		}
	);

}

function requestWrapper(apiPath, method, query, payload, successAction, errorAction) {
	request(apiPath, method, query, payload)
		.then(result => {
			successAction(result.data);
		})
		.catch(error => {
			errorAction(error);
		});
}

function loadAll(dataType, successAction, errorAction) {
	return dispatch => {
		let apiPath = path.join('backend/rest/metadata/filtered', dataType);
		let payload = {
			limit: PAGE_SIZE
		};
		request(apiPath, 'POST', null, payload)
			.then(result => {
				if (result.total < PAGE_SIZE) {
					// everything already loaded
					dispatch(successAction(result.data));
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
						let remainingData = _.flatten(results.map(res => res.data));
						dispatch(successAction({...result.data, ...remainingData}));
					});
				}

			})
			.catch(error => {
				dispatch(errorAction(error));
			});
	};
}

export default {
	add: add,
	loadAll,
	request: requestWrapper
}
