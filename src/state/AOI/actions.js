import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';

import config from '../../config';
import Select from '../Select';


// ============ creators ===========

let repeatLoad = 0;
function load() {
	return (dispatch, getState) => {
		dispatch(actionLoadRequest());

		let scope = Select.scopes.getActiveScopeData(getState());

		if (scope && scope.aoiLayer && scope.aoiLayer.key && scope.aoiLayer.idColumn) {

			let url = config.apiGeoserverWFSProtocol + '://' + path.join(config.apiGeoserverWFSHost, config.apiGeoserverWFSPath);
			url += '?service=wfs&version=2.0.0.&request=GetFeature&typeName=' + scope.aoiLayer.key + '&outputFormat=application/json&propertyName=' + scope.aoiLayer.idColumn;

			return fetch(url).then(response => {
				console.log('#### load AOI response', response);
				if (response.ok) {
					response.json().then(data => {
						if (data) {
							dispatch(actionLoadReceive(data.features));
						} else {
							dispatch(actionLoadError('no data returned'));
						}
					}).catch(function(err){
						if (repeatLoad < 3){
							load();
							repeatLoad++;
						}
					});
				} else {
					dispatch(actionLoadError(response))
				}
			});

		} else {
			dispatch(actionLoadError('cannot get layer data from scope'));
		}

	};
}

function setActiveKey(key) {
	return (dispatch, getState) => {
		dispatch(actionSetActiveKey(key));

		let activeAOI = Select.aoi.getActiveAoiData(getState());
		if (!activeAOI.geometry) {
			dispatch(loadGeometry(key));
		}
	};
}

function loadGeometry(key) {
	return (dispatch, getState) => {

		let scope = Select.scopes.getActiveScopeData(getState());

		if (scope && scope.aoiLayer && scope.aoiLayer.key) {

			let url = config.apiGeoserverWFSProtocol + '://' + path.join(config.apiGeoserverWFSHost, config.apiGeoserverWFSPath);
			url += '?service=wfs&version=2.0.0.&request=GetFeature&typeName=' + scope.aoiLayer.key + '&outputFormat=application/json&featureID=' + key;

			return fetch(url).then(response => {
				console.log('#### load AOI geometry response', response);
				if (response.ok) {
					response.json().then(data => {
						if (data && data.features && data.features.length === 1 && data.features[0].geometry) {
							dispatch(actionLoadGeometryReceive(key, data.features[0].geometry));
						} else {
							dispatch(actionLoadGeometryError('no data returned'));
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

function actionLoadGeometryReceive(key, geometry) {
	return {
		type: ActionTypes.AOI_GEOMETRY_RECEIVE,
		key: key,
		geometry: geometry
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
	load: load,
	setActiveKey: setActiveKey
}
