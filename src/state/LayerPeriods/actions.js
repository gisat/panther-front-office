import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';

import config from '../../config';
import Select from '../Select';

const TTL = 3;


// ============ creators ===========

function load(geometry, layerName, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return (dispatch, getState) => {
		dispatch(actionLoadForAoiRequest());

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendAoiLayerPeriodsPath);
		let body = {
			data: {
				geometry: geometry,
				layerName: layerName
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
			//if (response.ok) {
			//	response.json().then(data => {
			//		if (data) {
			//			dispatch(loadReceive(data.features, scope.aoiLayer));
			//		} else {
			//			dispatch(actionLoadForAoiError('no data returned'));
			//		}
			//	}).catch(function(err){
			//		if (ttl - 1){
			//			load(aoiKey, layerKey, ttl - 1);
			//		}
			//	});
			//} else {
			//	dispatch(actionLoadForAoiError(response))
			//}
		});

	};
}

function loadForAoi(aoiKey) {
	return (dispatch, getState) => {

		let state = getState();
		let aoi = _.find(Select.aoi.getAois(state), {key: aoiKey});
		_.each(state.wmsLayers.data, wmsLayer => {
			dispatch(load(aoi.geometry, wmsLayer.layer));
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


function actionLoadForAoiRequest() {
	return {
		type: ActionTypes.LAYER_PERIODS_AOI_REQUEST
	}
}

function actionLoadForAoiReceive(data) {
	return {
		type: ActionTypes.LAYER_PERIODS_AOI_RECEIVE,
		data: data
	}
}

function actionLoadForAoiError(error) {
	return {
		type: ActionTypes.LAYER_PERIODS_AOI_REQUEST_ERROR,
		error: error
	}
}

// ============ export ===========

export default {
	loadForAoi: loadForAoi
}
