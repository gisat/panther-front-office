import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';

import config from '../../config';
import Select from '../Select';
import utils from '../../utils/utils';

const TTL = 3;


// ============ creators ===========

function loadForAoiLayer(aoi, wmsLayer, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return (dispatch, getState) => {

		if (!_.isObject(aoi)) {
			aoi = _.find(Select.aoi.getAois(getState()), {key: aoi});
		}
		if (!_.isObject(wmsLayer)) {
			wmsLayer = _.find(getState().wmsLayers.data, {key: aoi});
		}

		dispatch(actionLoadForAoiRequest(aoi.key, wmsLayer.key));

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendAoiLayerPeriodsPath);
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

function loadForAoi(aoiKey) {
	return (dispatch, getState) => {

		let state = getState();
		let aoi = _.find(Select.aoi.getAois(state), {key: aoiKey});
		_.each(state.wmsLayers.data, wmsLayer => {
			dispatch(loadForAoiLayer(aoi, wmsLayer));
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

// ============ export ===========

export default {
	loadForAoi: loadForAoi
}
