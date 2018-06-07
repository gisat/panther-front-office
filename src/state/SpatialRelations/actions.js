import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';
import queryString from 'query-string';

import config from '../../config';
import Select from '../Select';

const TTL = 3;


// ============ creators ===========
function load(ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return (dispatch, getState) => {
		let state = getState();
		if (state.spatialDataSources.loading) {
			// already loading, do nothing
		} else {
			dispatch(actionLoadRelationsRequest());

			let activePlaceKey = Select.places.getActiveKey(state);
			let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata/spatial_relations');
			let query = queryString.stringify({
				place_id: activePlaceKey
			});
			if (query) {
				url += '?' + query;
			}

			return fetch(url, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			}).then(
				response => {
					console.log('#### load spatial relations response', response);
					let contentType = response.headers.get('Content-type');
					if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
						return response.json().then(data => {
							if (data.data && data.success) {
								dispatch(loadRelationsReceive(data.data));
							} else {
								dispatch(actionLoadRelationsError('no data returned'));
							}
						});
					} else {
						dispatch(actionLoadRelationsError(response))
					}
				},
				error => {
					console.log('#### load relations error', error);
					if (ttl - 1) {
						dispatch(load(ttl - 1));
					} else {
						dispatch(actionLoadRelationsError("spatialDataRelations#actions load: relations weren't loaded!"));
					}
				}
			);
		}
	};
}

function loadRelationsReceive(models) {
	return dispatch => {
		models = _.map(models, ({id, ...model}) => {
			return {...model, key: id};
		});
		dispatch(actionLoadRelationsReceive(models));
	};
}

// ============ actions ===========
function actionLoadRelationsReceive(data) {
	return {
		type: ActionTypes.SPATIAL_RELATIONS_RECEIVE,
		data: data
	}
}

function actionLoadRelationsRequest() {
	return {
		type: ActionTypes.SPATIAL_RELATIONS_REQUEST
	}
}

function actionLoadRelationsError(error) {
	return {
		type: ActionTypes.SPATIAL_RELATIONS_REQUEST_ERROR,
		error: error
	}
}

// ============ export ===========

export default {
	load: load,
	loadRelationsReceive: loadRelationsReceive
}
