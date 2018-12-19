import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import config from "../../config";
import path from "path";
import fetch from "isomorphic-fetch";
import Group from "../../data/Group";

import common from "../_common/actions";

const TTL = 5;

// ============ creators ===========

const add = common.add(ActionTypes.USER_GROUPS);

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
							dispatch(add(groups));
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

// ============ export ===========

export default {
	add,
	apiLoad
}
