import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import config from "../../config";
import path from "path";
import fetch from "isomorphic-fetch";
import Group from "../../data/Group";


const TTL = 5;

// ============ creators ===========

function add(groups){
	return dispatch => {
		if (!_.isArray(groups)) groups = [groups];
		dispatch(actionAdd(groups));
	};
}

function apiLoad(ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return dispatch => {
		// dispatch(actionApiLoadScopesRequest());

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendPath, 'backend/rest/group');

		return fetch(url, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		}).then(
			response => {
				let contentType = response.headers.get('Content-type');
				if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
					return response.json().then(data => {
						Promise.all(data.data.map(group => {
							return new Group({data: group}).then(group => {
								group.key = group.id;
								return group;
							});
						})).then(groups => {
							dispatch(actionAdd(groups));
						});
					});
				} else {
					// dispatch(actionApiLoadScopesRequestError('scopes#action Problem with loading scopes.'));
				}
			},
			error => {
				if (ttl - 1) {
					dispatch(apiLoad(ttl - 1));
				} else {
					// dispatch(actionApiLoadScopesRequestError('scopes#action Problem with loading scopes.'));
				}
			}
		);
	};
}

// ============ actions ===========

function actionAdd(groups) {
	return {
		type: ActionTypes.USER_GROUPS_ADD,
		data: groups
	}
}

// ============ export ===========

export default {
	add: add,
	apiLoad: apiLoad
}
