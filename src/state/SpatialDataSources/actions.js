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
			dispatch(actionLoadDataSourcesRequest());

			let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata/spatial_data_sources');

			return fetch(url, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			}).then(
				response => {
					console.log('#### load spatial data sources response', response);
					let contentType = response.headers.get('Content-type');
					if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
						return response.json().then(data => {
							if (data.data && data.success) {
								dispatch(actionLoadDataSourcesReceive(data.data));
							} else {
								dispatch(actionLoadDataSourcesError('no data returned'));
							}
						});
					} else {
						dispatch(actionLoadDataSourcesError(response))
					}
				},
				error => {
					console.log('#### load data sources error', error);
					if (ttl - 1) {
						dispatch(load(ttl - 1));
					} else {
						dispatch(actionLoadDataSourcesError("spatialDataSources#actions load: sources weren't loaded!"));
					}
				}
			);
		}
	};
}

// ============ actions ===========
function actionLoadDataSourcesReceive(data) {
	return {
		type: ActionTypes.SPATIAL_DATA_SOURCES_RECEIVE,
		data: data
	}
}

function actionLoadDataSourcesRequest() {
	return {
		type: ActionTypes.SPATIAL_DATA_SOURCES_REQUEST
	}
}

function actionLoadDataSourcesError(error) {
	return {
		type: ActionTypes.SPATIAL_DATA_SOURCES_REQUEST_ERROR,
		error: error
	}
}

// ============ export ===========

export default {
	load: load
}
