import queryString from "query-string";
import fetch from "isomorphic-fetch";

function request (url, method, query, payload) {

	if (query) {
		url += '?' + queryString.stringify(query);
	}

	return fetch(url, {
		method: method,
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
			throw error;
		}
	);
}

export default {
	request
}