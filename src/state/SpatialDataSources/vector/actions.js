import ActionTypes from '../../../constants/ActionTypes';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';
import queryString from 'query-string';

import config from '../../../config';
import Select from '../../Select';

const TTL = 3;


// ============ creators ===========


function loadFeaturesForBbox(dataSourceKey, bbox, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return (dispatch, getState) => {
		let state = getState();
		let dataSource = _.find(Select.spatialDataSources.getData(state), {key: dataSourceKey});
		if (dataSource && dataSource.type === "shapefile") {
			dispatch(actionLoadFeaturesForBboxRequest());

			let url = config.apiGeoserverWFSProtocol + '://' + path.join(config.apiGeoserverWFSHost, config.apiGeoserverWFSPath) + `?service=wfs&version=1.1.0&request=GetFeature&typeNames=${dataSource.data.layer_name}&bbox=${bbox.join(',')}&outputFormat=application/json`;

			return fetch(url, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			}).then(
				response => {
					console.log('#### load vector data source features for bbox response', response);
					let contentType = response.headers.get('Content-type');
					if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
						return response.json().then(data => {
							if (data.type === 'FeatureCollection' && data.features && data.features.length) {
								dispatch(loadFeaturesReceive(data.features));
							} else {
								dispatch(actionLoadFeaturesForBboxError('no data returned'));
							}
						});
					} else {
						dispatch(actionLoadFeaturesForBboxError(response))
					}
				},
				error => {
					console.log('#### load vector data source features for bbox error', error);
					if (ttl - 1) {
						dispatch(loadFeaturesForBbox(dataSourceKey, bbox, ttl - 1));
					} else {
						dispatch(actionLoadFeaturesForBboxError("requests failed"));
					}
				}
			);
		} else {
			// data source not found or not vector/shapefile
		}
	};
}


function loadFeaturesReceive(models) {
	return dispatch => {
		models = _.map(models, ({id, ...model}) => {
			return {key: id, data: {...model}};
		});
		dispatch(actionLoadFeaturesReceive(models));
	};
}

// ============ actions ===========


function actionLoadFeaturesReceive(data) {
	return {
		type: ActionTypes.SPATIAL_DATA_SOURCES_VECTOR_FEATURES_RECEIVE,
		data: data
	}
}

function actionLoadFeaturesForBboxRequest() {
	return {
		type: ActionTypes.SPATIAL_DATA_SOURCES_VECTOR_FEATURES_BBOX_REQUEST
	}
}

function actionLoadFeaturesForBboxError(error) {
	return {
		type: ActionTypes.SPATIAL_DATA_SOURCES_VECTOR_FEATURES_BBOX_REQUEST_ERROR,
		error: error
	}
}

// ============ export ===========

export default {
	loadFeaturesForBbox: loadFeaturesForBbox
}
