import ActionTypes from '../../../constants/ActionTypes';
import Select from '../../Select';
import _ from 'lodash';
import fetch from "isomorphic-fetch";
import path from "path";
import config from "../../../config";
import utils from "../../../utils/utils"

import queryString from 'query-string';

const TTL = 5;
let requestIntervals = {};

// ============ creators ===========
function closeOverlay(overlayKey){
	return (dispatch, getState) => {
		let overlay = Select.components.overlays.getOverlay(getState(), {key: overlayKey});
		let updatedData = overlay ? {...overlay, open: false} : {open: false};
		dispatch(actionUpdateOverlay(overlayKey, updatedData));
	}
}

function openOverlay(overlayKey){
	return (dispatch, getState) => {
		let overlay = Select.components.overlays.getOverlay(getState(), {key: overlayKey});
		let updatedData = overlay ? {...overlay, open: true} : {open: true};
		dispatch(actionUpdateOverlay(overlayKey, updatedData));
	}
}

/* Specific for scenario map editing overlay */
function setScenarioMapEditingLayerOpacity(value) {
	return (dispatch, getState) => {
		let overlay = Select.components.overlays.getOverlay(getState(), {key: 'scenarioMapEditing'});
		if (overlay){
			let updatedData = {...overlay, map: overlay.map ? {...overlay.map, layerOpacity: value} : {layerOpacity: value}};
			dispatch(actionUpdateOverlay('scenarioMapEditing', updatedData));
		}
	}
}

function clearRequestInterval(uuid) {
	if (requestIntervals.hasOwnProperty(uuid)) {
		clearInterval(requestIntervals[uuid]);
	}
}

function apiCreateLayerCopyRequest(dataSource, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return (dispatch, getState) => {
		let uuid = utils.guid();
		dispatch(actionApiCreateLayerCopyRequest({
			layerLoading: true,
			layerSource: null
		}));
		debugger;

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/importer/duplicate');
		let payload = {
			data: [{
				uuid: uuid,
				data: {
					layerName: dataSource
				}
			}]
		};

		let requestAttempt = () => {
			fetch(url, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify(payload)
			}).then((response) => {
				return response.json().then(data => {
					if (data && data.data && data.data.length){
						let layer = _.find(data.data, (item) => item.uuid === uuid);
						if (!layer){
							clearRequestInterval(uuid);
							dispatch(apiCreateLayerCopyRequestError("apiCreateLayerCopyRequest: Source with uuid " + uuid + "was not founf in response"));
						} else if (!data.success || layer.status === "error") {
							clearRequestInterval(uuid);
							dispatch(apiCreateLayerCopyRequestError(response.message));
						} else if (layer.status === 'running'){
							dispatch(actionApiCreateLayerCopyProgress({layerLoadingProgress: layer.progress}));
						} else if (layer.status === 'done') {
							clearRequestInterval(uuid);
							dispatch(actionApiCreateLayerCopyReceive({
								layerLoadingProgress: null,
								layerLoading: false,
								layerSource: layer.data.duplicatedLayerName
							}));
						}
					} else {
						clearRequestInterval(uuid);
						dispatch(apiCreateLayerCopyRequestError("apiCreateLayerCopyRequest: No data in response"));
					}
				}).catch(error => {
					clearRequestInterval(uuid);
					dispatch(apiCreateLayerCopyRequestError(error));
				});
			}, error => {
				console.log('#### create layer copy error', error);
				if (ttl - 1) {
					clearRequestInterval(uuid);
					dispatch(apiCreateLayerCopyRequest(dataSource, ttl - 1));
				} else {
					clearRequestInterval(uuid);
					dispatch(apiCreateLayerCopyRequestError("apiCreateLayerCopyRequest: Copy creating failed!"));
				}
			})
		};

		requestAttempt();
		requestIntervals[uuid] = setInterval(() => {
			requestAttempt();
		}, 5000);
	};
}

function apiCreateLayerCopyRequestError(error) {
	return (dispatch) => {
		console.error(error);
		dispatch(actionApiCreateLayerCopyRequestError({layerLoading: false}));
	}
}

// ============ actions ===========
function actionUpdateOverlay(overlayKey, data) {
	return {
		type: ActionTypes.COMPONENTS_OVERLAY_UPDATE,
		overlayKey: overlayKey,
		update: data
	}
}
function actionApiCreateLayerCopyProgress(data) {
	return {
		type: ActionTypes.COMPONENTS_OVERLAY_MAP_EDITING_COPY_PROGRESS,
		data: data
	}
}

function actionApiCreateLayerCopyReceive(data) {
	return {
		type: ActionTypes.COMPONENTS_OVERLAY_MAP_EDITING_COPY_RECEIVE,
		data: data
	}
}

function actionApiCreateLayerCopyRequest(data) {
	return {
		type: ActionTypes.COMPONENTS_OVERLAY_MAP_EDITING_COPY_REQUEST,
		data: data
	}
}

function actionApiCreateLayerCopyRequestError(data) {
	return {
		type: ActionTypes.COMPONENTS_OVERLAY_MAP_EDITING_COPY_REQUEST_ERROR,
		data: data
	}
}

// ============ export ===========

export default {
	closeOverlay: closeOverlay,
	openOverlay: openOverlay,

	apiCreateLayerCopyRequest: apiCreateLayerCopyRequest,
	setScenarioMapEditingLayerOpacity: setScenarioMapEditingLayerOpacity
}
