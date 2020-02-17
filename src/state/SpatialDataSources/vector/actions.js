import ActionTypes from '../../../constants/ActionTypes';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';
import queryString from 'query-string';

import config from '../../../config';
import Select from '../../Select';

import common from '../../_common/actions';

import {utils} from "panther-utils"

const TTL = 3;

const useKeys = common.useKeys(Select.spatialDataSources.vector.getSubstate, 'spatial', ActionTypes.SPATIAL_DATA_SOURCES.VECTOR, 'data');
const useKeysClear = common.useKeysClear(ActionTypes.SPATIAL_DATA_SOURCES.VECTOR);
const useIndexed = common.useIndexed(Select.spatialDataSources.vector.getSubstate, 'spatial', ActionTypes.SPATIAL_DATA_SOURCES.VECTOR, 'data');
const useIndexedBatch = common.useIndexedBatch('spatial', ActionTypes.SPATIAL_DATA_SOURCES.VECTOR, 'data');
const useIndexedClear = common.useIndexedClear(ActionTypes.SPATIAL_DATA_SOURCES.VECTOR);
const clearIndex = common.clearIndex(ActionTypes.SPATIAL_DATA_SOURCES.VECTOR);
const addBatch = common.addBatch(ActionTypes.SPATIAL_DATA_SOURCES.VECTOR);
const addBatchIndex = common.addBatchIndex(ActionTypes.SPATIAL_DATA_SOURCES.VECTOR);



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
								return dispatch(loadFeaturesReceive(dataSourceKey, data.features));
							} else {
								dispatch(actionLoadFeaturesForBboxError('no data returned'));
							}
						});
					} else {
						dispatch(actionLoadFeaturesForBboxError(response));
						return false;
					}
				},
				error => {
					console.log('#### load vector data source features for bbox error', error);
					if (ttl - 1) {
						dispatch(loadFeaturesForBbox(dataSourceKey, bbox, ttl - 1));
					} else {
						dispatch(actionLoadFeaturesForBboxError("requests failed"));
					}
					return false;
				}
			);
		} else {
			// data source not found or not vector/shapefile
			return Promise.reject();
		}
	};
}

function loadFeaturesForPoint(dataSourceKey, point, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return (dispatch, getState) => {
		let state = getState();
		let dataSource = _.find(Select.spatialDataSources.getData(state), {key: dataSourceKey});
		if (dataSource && dataSource.type === "shapefile") {
			dispatch(actionLoadFeaturesForPointRequest());

			let url = [
				config.apiGeoserverWFSProtocol,
				`://`,
				path.join(config.apiGeoserverWFSHost, config.apiGeoserverWFSPath),
				`?service=wfs&version=1.1.0`,
				`&request=GetFeature`,
				`&typeNames=${dataSource.data.layer_name}`,
				`&FILTER=<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><Intersects><PropertyName>the_geom</PropertyName><gml:Point srsName="EPSG:4326"><gml:coordinates>${point.longitude},${point.latitude}</gml:coordinates></gml:Point></Intersects></Filter>`,
				`&outputFormat=application/json`
			];

			url = url.join(``);

			return fetch(url, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			}).then(
				response => {
					console.log('#### load vector data source features for point response', response);
					let contentType = response.headers.get('Content-type');
					if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
						return response.json().then(data => {
							if (data.type === 'FeatureCollection' && data.features && data.features.length) {
								return dispatch(loadFeaturesReceive(dataSourceKey, data.features));
							} else {
								dispatch(actionLoadFeaturesForPointRequest('no data returned'));
							}
						});
					} else {
						dispatch(actionLoadFeaturesForPointError(response));
						return false;
					}
				},
				error => {
					console.log('#### load vector data source features for point error', error);
					if (ttl - 1) {
						dispatch(loadFeaturesForPoint(dataSourceKey, point, ttl - 1));
					} else {
						dispatch(actionLoadFeaturesForPointError("requests failed"));
					}
					return false;
				}
			);
		} else {
			// data source not found or not vector/shapefile
			return Promise.reject();
		}
	};
}

function loadFeaturesForBboxAndSelect(dataSourceKey, bbox, selectionMode) {
	return dispatch => {
		dispatch(loadFeaturesForBbox(dataSourceKey, bbox)).then(({dataSourceKey, models}) => {
			dispatch(actionSelectFeatures(dataSourceKey, _.map(models, 'key'), selectionMode));
		});
	}
}

function loadFeaturesForPointAndSelect(dataSourceKey, point, selectionMode) {
	return dispatch => {
		dispatch(loadFeaturesForPoint(dataSourceKey, point)).then(({dataSourceKey, models}) => {
			dispatch(actionSelectFeatures(dataSourceKey, _.map(models, 'key'), selectionMode));
		});
	}
}

function loadFeaturesReceive(dataSourceKey, models) {
	return dispatch => {
		models = _.map(models, ({id, ...model}) => {
			return {key: id, data: {...model}};
		});
		dispatch(actionLoadFeaturesReceive(dataSourceKey, models));
		return {dataSourceKey, models};
	};
}

function updateSelectedFeatures(dataSourceKey, luClass) { //todo generalize
	return (dispatch, getState) => {
		let state = getState();
		let dataSource = _.find(Select.spatialDataSources.getData(state), {key: dataSourceKey});
		let selectedFeatures = Select.spatialDataSources.vector.noMemoGetSelectedFeaturesBySourceKey(state, {dataSourceKey});

		let body = `<wfs:Transaction service="WFS" version="1.0.0"
				 xmlns:topp="http://www.openplans.org/topp"
				 xmlns:ogc="http://www.opengis.net/ogc"
				 xmlns:wfs="http://www.opengis.net/wfs">`;
		_.each(selectedFeatures, feature => {
			body += `<wfs:Update typeName="${dataSource.data.layer_name}">
								<ogc:Filter>
									<ogc:FeatureId fid="${feature.key}"/>
								</ogc:Filter>`;
			body += `<wfs:Property>
								<wfs:Name>CODE2012</wfs:Name>
								<wfs:Value>${luClass}</wfs:Value>
							</wfs:Property>`;
			body += `</wfs:Update>`;
		});
		body += `</wfs:Transaction>`;

		console.log('#### update polygon request body', body);

		let url = config.apiGeoserverWFSProtocol + '://' + path.join(config.apiGeoserverWFSHost, config.apiGeoserverWFSPath) + '?service=wfs&version=1.1.0&request=Transaction';

		fetch(url, {
			body: body, // must match 'Content-Type' header
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'include', // include, same-origin, *omit
			headers: {
				'user-agent': 'Mozilla/4.0 MDN Example',
				'content-type': 'text/xml'
			},
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, cors, *same-origin
			redirect: 'follow', // manual, *follow, error
			referrer: 'no-referrer', // *client, no-referrer
		}).then(
			response => {
				//todo check response ?
				dispatch(actionAddEditedFeatures(dataSourceKey, _.map(selectedFeatures, feature => {
					return {key: feature.key, data: {properties: {CODE2012: luClass}, geometry: feature.data.geometry}}; //todo get column from attribute?
				})));
				console.log('#### update polygon request response', response);
			},
			error => {
				console.log('#### update polygon request error', error);
			}
		);
	}
}

function updateFeatures(dataSourceKey, featureKeys) { //todo
	return (dispatch, getState) => {
		let state = getState();
		let dataSource = _.find(Select.spatialDataSources.getData(state), {key: dataSourceKey});
		let editedFeatures = Select.spatialDataSources.vector.getEditedFeatures(state)[dataSourceKey];

		let body = `<wfs:Transaction service="WFS" version="1.0.0"
				 xmlns:topp="http://www.openplans.org/topp"
				 xmlns:ogc="http://www.opengis.net/ogc"
				 xmlns:wfs="http://www.opengis.net/wfs">`;
		_.each(featureKeys, key => {
			let editedFeature = _.find(editedFeatures, {key: key});
			body += `<wfs:Update typeName="${dataSource.data.layer_name}">
								<ogc:Filter>
									<ogc:FeatureId fid="${key}"/>
								</ogc:Filter>`;
			_.each(editedFeature.data.properties, (value, property) => {
				body += `<wfs:Property>
									<wfs:Name>${property}</wfs:Name>
									<wfs:Value>${value}</wfs:Value>
								</wfs:Property>`;
			});
			body += `</wfs:Update>`;
		});
		body += `</wfs:Transaction>`;

		console.log('#### update polygon request body', body);

		let url = config.apiGeoserverWFSProtocol + '://' + path.join(config.apiGeoserverWFSHost, config.apiGeoserverWFSPath) + '?service=wfs&version=1.1.0&request=Transaction';

		//fetch(url, {
		//	body: body, // must match 'Content-Type' header
		//	cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		//	credentials: 'include', // include, same-origin, *omit
		//	headers: {
		//		'user-agent': 'Mozilla/4.0 MDN Example',
		//		'content-type': 'text/xml'
		//	},
		//	method: 'POST', // *GET, POST, PUT, DELETE, etc.
		//	mode: 'cors', // no-cors, cors, *same-origin
		//	redirect: 'follow', // manual, *follow, error
		//	referrer: 'no-referrer', // *client, no-referrer
		//}).then(
		//	response => {
		//		console.log('#### update polygon request response', response);
		//	},
		//	error => {
		//		console.log('#### update polygon request error', error);
		//	}
		//);
	};
}

function loadLayerData(filter, componentId) {
	return (dispatch, getState) => {
		let additionalParams = {};
		let geometriesAccuracy = Select.app.getLocalConfiguration(getState(), 'geometriesAccuracy');

		if (geometriesAccuracy) {
			additionalParams.transformation = {
				snapToGrid: {
					size: geometriesAccuracy
				},
				transform: 4326
			}
		}

		return dispatch(useIndexedBatch(null, filter, null, componentId, 'spatialDataSourceKey', additionalParams));
	}
}

// ============ actions ===========


function actionLoadFeaturesReceive(dataSourceKey, data) {
	return {
		type: ActionTypes.SPATIAL_DATA_SOURCES_VECTOR_FEATURES_RECEIVE,
		dataSourceKey: dataSourceKey,
		data: data
	}
}

function actionLoadFeaturesForBboxRequest() {
	return {
		type: ActionTypes.SPATIAL_DATA_SOURCES_VECTOR_FEATURES_BBOX_REQUEST
	}
}

function actionLoadFeaturesForPointRequest() {
	return {
		type: ActionTypes.SPATIAL_DATA_SOURCES_VECTOR_FEATURES_POINT_REQUEST
	}
}

function actionLoadFeaturesForBboxError(error) {
	return {
		type: ActionTypes.SPATIAL_DATA_SOURCES_VECTOR_FEATURES_BBOX_REQUEST_ERROR,
		error: error
	}
}

function actionLoadFeaturesForPointError(error) {
	return {
		type: ActionTypes.SPATIAL_DATA_SOURCES_VECTOR_FEATURES_POINT_REQUEST_ERROR,
		error: error
	}
}

function actionSelectFeatures(dataSourceKey, featureKeys, selectionMode) {
	return {
		type: ActionTypes.SPATIAL_DATA_SOURCES_VECTOR_FEATURES_SELECT,
		dataSourceKey,
		featureKeys,
		selectionMode
	}
}

function actionAddEditedFeatures(dataSourceKey, features) {
	return {
		type: ActionTypes.SPATIAL_DATA_SOURCES_VECTOR_FEATURES_EDITED_ADD,
		dataSourceKey,
		features
	}
}

// ============ export ===========

export default {
	addBatch,
	addBatchIndex,
	loadFeaturesForBbox: loadFeaturesForBbox,
	loadFeaturesForBboxAndSelect: loadFeaturesForBboxAndSelect,
	updateSelectedFeatures: updateSelectedFeatures,
	loadFeaturesForPointAndSelect,

	loadLayerData,
	useKeys,
	useKeysClear,
	useIndexed,
	useIndexedClear,
	clearIndex
}
