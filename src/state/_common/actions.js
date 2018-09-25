import _ from "lodash";
import config from "../../config";
import queryString from "query-string";
import path from "path";
import fetch from "isomorphic-fetch";

const TTL = 5;

const add = (action) => {
	return (data) => {
		return dispatch => {
			if (!_.isArray(data)) data = [data];
			dispatch(action(data));
		};
	}
};

function request(apiPath, method, query, payload, successAction, errorAction, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return (dispatch) => {
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
							dispatch(successAction(body.data));
						} else {
							dispatch(errorAction('no data returned'));
						}
					});
				} else {
					dispatch(errorAction(response))
				}
			},
			error => {
				if (ttl - 1) {
					dispatch(request(apiPath, method, query, payload, successAction, errorAction, ttl - 1));
				} else {
					dispatch(errorAction(error));
				}
			}
		);

	};
}

export default {
	add: add,
	request: request
}
