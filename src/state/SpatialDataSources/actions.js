import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';
import queryString from 'query-string';

import config from '../../config';
import Select from '../Select';

import vectorActions from './vector/actions';

const TTL = 3;


// ============ creators ===========

function add(sources) {
	return dispatch => {
		if (!_.isArray(sources)) sources = [sources];
		dispatch(actionAdd(sources));
	};
}

function cloneAndUpdate(sourceKey, update){
	return (dispatch, getState) => {
		let source = Select.spatialDataSources.getDataSource(getState(), sourceKey);
		let updatedClone = {...source, ...update};
		dispatch(add(updatedClone));
	}
}

// todo Temporary solution for download - open url in new window
function download(sourceName){
	return (dispatch) => {
		let source = sourceName;
		if (source){
			dispatch(actionDownloadSourceFileRequest());
			let url = config.apiGeoserverWFSProtocol + '://' + path.join(config.apiGeoserverWFSHost, config.apiGeoserverOWSPath);
			let query = queryString.stringify({
				service: 'WFS',
				version: '1.0.0',
				request: 'GetFeature',
				typeName: source,
				outputFormat: 'SHAPE-ZIP'
			});
			if (query) {
				url += '?' + query;
			}
			window.open(url, '_blank');
		} else {
			dispatch(actionDownloadSourceFileError('SpatialDataSources actions#download: sourceName is:', sourceName));
		}
	};
}

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
								dispatch(loadDataSourcesReceive(data.data));
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

function loadFiltered(filterData, ttl){
	if (_.isUndefined(ttl)) ttl = TTL;
	return (dispatch, getState) => {
		let state = getState();
		if (state.spatialDataSources.loading) {
			// already loading, do nothing
		} else {
			let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata/spatial_data_sources/filtered');
			let filter = {any: null};
			if (filterData){
				filter.any = filterData;
			}

			dispatch(actionLoadFilteredDataSourcesRequest(filter));

			return fetch(url, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify(filter)
			}).then(
				response => {
					console.log('#### load filtered spatial data sources response', response);
					let contentType = response.headers.get('Content-type');
					if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
						return response.json().then(data => {
							if (data.data && data.success) {
								dispatch(loadDataSourcesReceive(data.data));
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
						dispatch(load(filterData, ttl - 1));
					} else {
						dispatch(actionLoadDataSourcesError("spatialDataSources#actions loadFiltered: sources weren't loaded!"));
					}
				}
			);
		}
	};
}

function loadDataSourcesReceive(models) {
	return dispatch => {
		models = _.map(models, ({id, ...model}) => {
			return {...model, key: id};
		});
		dispatch(actionLoadDataSourcesReceive(models));
	};
}

// ============ actions ===========
function actionAdd(data) {
	return {
		type: ActionTypes.SPATIAL_DATA_SOURCES_ADD,
		data: data
	}
}

function actionDownloadSourceFileRequest(){
	return {
		type: ActionTypes.SPATIAL_DATA_SOURCES_DOWNLOAD_FILE_REQUEST
	}
}

function actionDownloadSourceFileError(message){
	return {
		type: ActionTypes.SPATIAL_DATA_SOURCES_DOWNLOAD_FILE_ERROR,
		message: message
	}
}

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

function actionLoadFilteredDataSourcesRequest(filter) {
	return {
		type: ActionTypes.SPATIAL_DATA_SOURCES_FILTERED_REQUEST,
		filter: filter
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
	cloneAndUpdate: cloneAndUpdate,
	download: download,
	load: load,
	loadFiltered: loadFiltered,
	vector: vectorActions
}
