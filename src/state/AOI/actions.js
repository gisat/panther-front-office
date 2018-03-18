import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';

import config from '../../config';
import Select from '../Select';


// ============ creators ===========

function load() {
	//geonode:i2_lpis_cr_wgs84_plzen
	//NKOD_DPB
	return dispatch => {

		dispatch(actionLoadRequest());

		let scope = Select.scopes.getActiveScopeData();

		if (scope && scope.aoiLayer && scope.aoiLayer.key && scope.aoiLayer.idColumn) {

			let url = path.join(config.apiGeoserverWFSProtocol, '://', config.apiGeoserverWFSHost, config.apiGeoserverWFSPath);
			url += '?service=wfs&version=2.0.0.&request=GetFeature&typeName=' + scope.aoiLayer.key + '&outputFormat=application/json&propertyName=' + scope.aoiLayer.idColumn;

			return fetch(url).then(response => {
				console.log('#### load AOI response', response);
				if (response.ok) {
					response.json().then(data => {
						if (data) {
							dispatch(actionLoadReceive(data));
						} else {
							dispatch(actionLoadError('no data returned'));
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
	return dispatch => {
		dispatch(actionSetActiveKey(key));
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

// ============ export ===========

export default {
	load: load,
	setActiveKey: setActiveKey
}
