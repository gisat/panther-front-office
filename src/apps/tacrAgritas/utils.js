import queryString from "query-string";
import fetch from "isomorphic-fetch";

function fillStyleTemplate(style) {
	return {
		"key":"test",
		"data":{
			"nameDisplay":"",
			"source":"definition",
			"definition":{
				"rules":[
					{
						"styles":[style]
					}
				]
			}
		}
	}
}

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
			if (response.ok) {
				return response.json().then(body => {
					if (body) {
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
	fillStyleTemplate,
	request
}

export const hoveredStyleDefinition = {
	"rules":[
		{
			"styles": [
				{
					"outlineColor": "#ff66b3",
					"outlineWidth": 4
				}
			]
		}
	]
};

export const selectedStyleDefinition = {
	"rules":[
		{
			"styles": [
				{
					"outlineColor": "#ff00ff",
					"outlineWidth": 4
				}
			]
		}
	]
};