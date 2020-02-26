import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';

import Select from '../Select';

const TTL = 3;


// ============ creators ===========

function loadForAoiLayer(aoi, wmsLayer, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return (dispatch, getState) => {
		const state = getState();
		const apiBackendProtocol = Select.app.getLocalConfiguration(state, 'apiBackendProtocol');
		const apiBackendHost = Select.app.getLocalConfiguration(state, 'apiBackendHost');
		const apiBackendPath = Select.app.getLocalConfiguration(state, 'apiBackendPath');
		const apiBackendAoiLayerPeriodsPath = Select.app.getLocalConfiguration(state, 'apiBackendAoiLayerPeriodsPath');

		if (!_.isObject(aoi)) {
			aoi = _.find(Select.aoi.getAois(getState()), {key: aoi});
		}
		if (!_.isObject(wmsLayer)) {
			wmsLayer = _.find(getState().wmsLayers.data, {key: wmsLayer});
		}

		dispatch(actionLoadForAoiRequest(aoi.key, wmsLayer.key));

		let url = apiBackendProtocol + '://' + path.join(apiBackendHost, apiBackendPath, apiBackendAoiLayerPeriodsPath);
		let body = {
			data: {
				geometry: aoi.geometry,
				layerName: wmsLayer.layerName
			}
		};

		return fetch(url, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json'
			}
		}).then(response => {
			console.log('#### LayerPeriods receive', response);
			if (response.ok) {
				response.json().then(data => {
					if (data) {
						dispatch(actionLoadForAoiLayerReceive(aoi.key, wmsLayer.key, data.dates));
					} else {
						dispatch(actionloadForAoiLayerError(aoi.key, wmsLayer.key, 'no data returned'));
					}
				}).catch(function(err){
					if (ttl - 1){
						loadForAoiLayer(aoi, wmsLayer, ttl - 1);
					}
				});
			} else {
				dispatch(actionloadForAoiLayerError(aoi.key, wmsLayer.key, response))
			}
		});

	};
}

function loadForPlaceLayer(place, wmsLayer, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return (dispatch, getState) => {
		const state = getState();
		const apiBackendProtocol = Select.app.getLocalConfiguration(state, 'apiBackendProtocol');
		const apiBackendHost = Select.app.getLocalConfiguration(state, 'apiBackendHost');
		const apiBackendPath = Select.app.getLocalConfiguration(state, 'apiBackendPath');
		const apiBackendAoiLayerPeriodsPath = Select.app.getLocalConfiguration(state, 'apiBackendAoiLayerPeriodsPath');

		if (!_.isObject(place)) {
			place = _.find(Select.places.getPlaces(getState()), {key: place});
		}
		if (!_.isObject(wmsLayer)) {
			wmsLayer = _.find(getState().wmsLayers.data, {key: wmsLayer});
		}

		dispatch(actionLoadForPlaceRequest(place.key, wmsLayer.key));

		let url = apiBackendProtocol + '://' + path.join(apiBackendHost, apiBackendPath, apiBackendAoiLayerPeriodsPath);
		let body = {
			data: {
				geometry: place.geometry,
				layerName: wmsLayer.layerName
			}
		};

		return fetch(url, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json'
			}
		}).then(response => {
			console.log('#### LayerPeriods receive', response);
			if (response.ok) {
				response.json().then(data => {
					if (data) {
						dispatch(actionLoadForPlaceLayerReceive(place.key, wmsLayer.key, data.dates));
					} else {
						dispatch(actionLoadForPlaceLayerError(place.key, wmsLayer.key, 'no data returned'));
					}
				}).catch(function(err){
					if (ttl - 1){
						loadForPlaceLayer(place, wmsLayer, ttl - 1);
					}
				});
			} else {
				dispatch(actionLoadForPlaceLayerError(place.key, wmsLayer.key, response))
			}
		});
	};
}

function loadForKeyLayer(key, geometry, wmsLayer, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return (dispatch, getState) => {
		let state = getState();
		const localConfig = Select.app.getCompleteLocalConfiguration(state);

		if (!_.isObject(wmsLayer)) {
			wmsLayer = _.find(state.wmsLayers.data, {key: wmsLayer});
		}

		dispatch(actionLoadForKeyLayerRequest(key, geometry, wmsLayer.key));

		let url = localConfig.apiBackendProtocol + '://' + path.join(localConfig.apiBackendHost, localConfig.apiBackendPath, localConfig.apiBackendAoiLayerPeriodsPath);
		let body = {
			data: {
				geometry: geometry,
				layerName: wmsLayer.layerName
			}
		};

		return fetch(url, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json'
			}
		}).then(response => {
			console.log('#### LayerPeriods receive', response);
			if (response.ok) {
				response.json().then(data => {
					if (data) {
						dispatch(actionLoadForKeyLayerReceive(key, geometry, wmsLayer.key, data.dates));
					} else {
						dispatch(actionLoadForKeyLayerError(key, geometry, wmsLayer.key, 'no data returned'));
					}
				}).catch(function(err){
					if (ttl - 1){
						loadForKeyLayer(key, geometry, wmsLayer, ttl - 1);
					}
				});
			} else {
				dispatch(actionLoadForKeyLayerError(key, geometry, wmsLayer.key, response))
			}
		});
	};
}

function loadForAoi(aoiKey) {
	return (dispatch, getState) => {

		let state = getState();
		let aoi = _.find(Select.aoi.getAois(state), {key: aoiKey});
		_.each(state.wmsLayers.data, wmsLayer => {
			if (wmsLayer.getDates) dispatch(loadForAoiLayer(aoi, wmsLayer));
		});

	};
}

function loadForPlace(placeKey) {
	return (dispatch, getState) => {
		let state = getState();
		let place = _.find(Select.places.getPlaces(state), {key: placeKey});
		if (place && place.geometry){
			_.each(state.wmsLayers.data, wmsLayer => {
				if (wmsLayer.getDates) dispatch(loadForPlaceLayer(place, wmsLayer));
			});
		}
	};
}

function loadForKey(key, geometry) {
	return (dispatch, getState) => {
		let state = getState();
		let layers = Select.wmsLayers.getLayersWithGetDate(state);
		_.each(layers, wmsLayer => {
			dispatch(loadForKeyLayer(key, geometry, wmsLayer));
		});
	};
}

//function loadReceive(features, aoiLayer) {
//	return dispatch => {
//		features = _.map(features, feature => {
//			return {
//				key: feature.properties[aoiLayer.fidColumn || 'fid'],
//				code: feature.properties[aoiLayer.idColumn]
//			};
//		});
//		dispatch(actionLoadReceive(features));
//	};
//}

// ============ actions ===========


function actionLoadForAoiRequest(aoiKey, layerKey) {
	return {
		type: ActionTypes.LAYER_PERIODS_AOI_LAYER_REQUEST,
		aoiKey: aoiKey,
		layerKey: layerKey
	}
}

function actionLoadForAoiLayerReceive(aoiKey, layerKey, periods) {
	return {
		type: ActionTypes.LAYER_PERIODS_AOI_LAYER_RECEIVE,
		aoiKey: aoiKey,
		layerKey: layerKey,
		periods: periods
	}
}

function actionloadForAoiLayerError(aoiKey, layerKey, error) {
	return {
		type: ActionTypes.LAYER_PERIODS_AOI_LAYER_REQUEST_ERROR,
		aoiKey: aoiKey,
		layerKey: layerKey,
		error: error
	}
}

function actionLoadForPlaceRequest(placeKey, layerKey) {
	return {
		type: ActionTypes.LAYER_PERIODS_PLACE_LAYER_REQUEST,
		placeKey: placeKey,
		layerKey: layerKey
	}
}

function actionLoadForPlaceLayerReceive(placeKey, layerKey, periods) {
	return {
		type: ActionTypes.LAYER_PERIODS_PLACE_LAYER_RECEIVE,
		placeKey: placeKey,
		layerKey: layerKey,
		periods: periods
	}
}

function actionLoadForPlaceLayerError(placeKey, layerKey, error) {
	return {
		type: ActionTypes.LAYER_PERIODS_PLACE_LAYER_REQUEST_ERROR,
		placeKey: placeKey,
		layerKey: layerKey,
		error: error
	}
}

function actionLoadForKeyLayerRequest(key, geometry, layerKey) {
	return {
		type: ActionTypes.LAYER_PERIODS_KEY_LAYER_REQUEST,
		key: key,
		geometry: geometry,
		layerKey: layerKey
	}
}

function actionLoadForKeyLayerReceive(key, geometry, layerKey, periods) {
	return {
		type: ActionTypes.LAYER_PERIODS_KEY_LAYER_RECEIVE,
		key: key,
		geometry: geometry,
		layerKey: layerKey,
		periods: periods
	}
}

function actionLoadForKeyLayerError(key, geometry, layerKey, error) {
	return {
		type: ActionTypes.LAYER_PERIODS_KEY_LAYER_REQUEST_ERROR,
		key: key,
		geometry: geometry,
		layerKey: layerKey,
		error: error
	}
}

// ============ export ===========

export default {
	loadForAoi: loadForAoi,
	loadForPlace: loadForPlace,
	loadForKey
}
