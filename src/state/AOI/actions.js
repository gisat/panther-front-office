import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';

import config from '../../config';
import Select from '../Select';
import LayerPeriods from '../LayerPeriods/actions';

const TTL = 5;
const TTL_GEOMETRY = 5;


// ============ creators ===========

function add(key) {
	return (dispatch) => {
		dispatch(actionAdd(key));
	};
}

function load(ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return (dispatch, getState) => {

		let state = getState();
		if (state.aoi.loading) {
			// already loading, do nothing
			console.log('#### load AOI: duplicate load canceled');
		} else {
			dispatch(actionLoadRequest());

			let scope = Select.scopes.getActiveScopeData(state);

			if (scope && scope.aoiLayer && scope.aoiLayer.key && scope.aoiLayer.idColumn && scope.aoiLayer.fidColumn) {

				let url = config.apiGeoserverWFSProtocol + '://' + path.join(config.apiGeoserverWFSHost, config.apiGeoserverWFSPath);
				url += '?service=wfs&version=2.0.0.&request=GetFeature&typeName=' + scope.aoiLayer.key + '&outputFormat=application/json&&srsName=urn:ogc:def:crs:EPSG::4326&propertyName=' + scope.aoiLayer.idColumn + ',' + scope.aoiLayer.fidColumn;

				return fetch(url).then(
					response => {
						console.log('#### load AOI response', response);
						let contentType = response.headers.get('Content-type');
						if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
							return response.json().then(data => {
								if (data) {
									dispatch(loadReceive(data.features, scope.aoiLayer));
								} else {
									dispatch(actionLoadError('no data returned'));
								}
							});
						} else {
							dispatch(actionLoadError(response))
						}
					},
					error => {
						console.log('#### load AOI error', error);
						if (ttl - 1) {
							dispatch(load(ttl - 1));
						} else {
							dispatch(actionLoadError("AOI#actions load: AOI weren't loaded!"));
						}
					}
				);

			} else {
				dispatch(actionLoadError('cannot get layer data from scope'));
			}

		}

	};
}

function loadReceive(features, aoiLayer) {
	return dispatch => {
		features = _.map(features, feature => {
			return {
				key: feature.properties[aoiLayer.fidColumn || 'fid'],
				code: feature.properties[aoiLayer.idColumn]
			};
		});
		dispatch(actionLoadReceive(features));
	};
}

function setActiveKey(key) {
	return (dispatch, getState) => {
		let aois = Select.aoi.getAois(getState());
		dispatch(actionSetActiveKey(key));
		if (aois){
			return dispatch(ensureGeometry(key)).then(() => {
				return dispatch(LayerPeriods.loadForAoi(key));
			});
		} else {
			return Promise.resolve();
		}
	};
}

function ensureGeometry(key) {
	return (dispatch, getState) => {
		let aois = Select.aoi.getAois(getState());
		let aoi = _.find(aois, {key: key});
		if (!aoi.geometry) {
			return dispatch(loadGeometry(key));
		} else {
			return Promise.resolve();
		}
	};
}

function loadGeometry(key,ttl) {
	if (_.isUndefined(ttl)) ttl = TTL_GEOMETRY;
	return (dispatch, getState) => {

		let scope = Select.scopes.getActiveScopeData(getState());

		if (scope && scope.aoiLayer && scope.aoiLayer.key) {

			let url = config.apiGeoserverWFSProtocol + '://' + path.join(config.apiGeoserverWFSHost, config.apiGeoserverWFSPath);
			url += '?service=wfs&version=2.0.0.&request=GetFeature&typeName=' + scope.aoiLayer.key + '&outputFormat=application/json&srsName=urn:ogc:def:crs:EPSG::4326&featureID=' + key;

			return fetch(url).then(response => {
				console.log('#### load AOI geometry response', response);
				if (response.ok) {
					return response.json().then(data => {
						if (data && data.features && data.features.length === 1 && data.features[0].geometry) {
							let code = data.features[0].properties[scope.aoiLayer.idColumn];
							dispatch(actionLoadGeometryReceive(key, data.features[0].geometry, code));
						} else {
							dispatch(actionLoadGeometryError('no data returned'));
						}
					}).catch(function(err){
						if (ttl - 1){
							dispatch(loadGeometry(key, ttl - 1));
						} else {
							throw new Error("AOI#actions loadGeometry: Geometry wasn't loaded!");
						}
					});
				} else {
					dispatch(actionLoadGeometryError(response))
				}
			});

		} else {
			dispatch(actionLoadGeometryError('cannot get layer data from scope'));
		}

	};
}

// ============ actions ===========

function actionAdd(key) {
	return {
		type: ActionTypes.AOI_ADD,
		data: [{
			key: key
		}]
	}
}

function actionSetActiveKey(key) {
	return {
		type: ActionTypes.AOI_SET_ACTIVE,
		key: key
	}
}

function actionLoadRequest() {
	return {
		type: ActionTypes.AOI_REQUEST
	}
}

function actionLoadReceive(data) {
	return {
		type: ActionTypes.AOI_RECEIVE,
		data: data
	}
}

function actionLoadError(error) {
	return {
		type: ActionTypes.AOI_REQUEST_ERROR,
		error: error
	}
}

function actionLoadGeometryReceive(key, geometry, code) {
	return {
		type: ActionTypes.AOI_GEOMETRY_RECEIVE,
		key: key,
		geometry: geometry,
		code: code
	}
}

function actionLoadGeometryError(error) {
	return {
		type: ActionTypes.AOI_GEOMETRY_REQUEST_ERROR,
		error: error
	}
}

// ============ export ===========

export default {
	add: add,
	load: load,
	setActiveKey: setActiveKey
}
