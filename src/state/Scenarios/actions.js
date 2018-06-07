import Action from '../Action';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import config from '../../config';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';
import queryString from 'query-string';
import utils from '../../utils/utils';

let requestIntervals = {};

const TTL = 5;

// ============ creators ===========

function add(scenarios) {
	return dispatch => {
		if (!_.isArray(scenarios)) scenarios = [scenarios];
		dispatch(actionAdd(scenarios));
	};
}

function setActive(key) {
	return (dispatch) => {
		if (!_.isArray(key)) key = [key];
		dispatch(actionSetActive(key));
	};
}


// Edited data
function addEditedScenario(key){
	return (dispatch, getState) => {
		let activeCaseScenarioKeys = Select.scenarios.getActiveCaseScenarioKeys(getState());
		let activeCaseEditedScenarioKeys = Select.scenarios.getActiveCaseEditedScenarioKeys(getState());
		let updatedScenarioKeys = activeCaseEditedScenarioKeys ? [...activeCaseEditedScenarioKeys, ...[key]] :
			(activeCaseScenarioKeys ? [...activeCaseScenarioKeys, ...[key]] : [key] );
		dispatch(actionUpdateEditedScenarios([{key: key}]));
		dispatch(updateEditedActiveCase('scenarios', updatedScenarioKeys));
	};
}

function removeEditedActiveCase() {
	return (dispatch, getState) => {
		let activeCaseKey = Select.scenarios.getActiveCaseKey(getState());
		dispatch(actionRemoveEditedCases([activeCaseKey]));
	};
}

/**
 * It removes edited scenarios for active case
 */
function removeActiveCaseEditedScenarios() {
	return (dispatch, getState) => {
		let activeCaseScenarioKeys = Select.scenarios.getActiveCaseScenarioKeys(getState());
		let activeCaseEditedScenarioKeys = Select.scenarios.getActiveCaseEditedScenarioKeys(getState());
		let keys = [];
		if (activeCaseScenarioKeys){
			keys = [...keys, ...activeCaseScenarioKeys];
		}
		if (activeCaseEditedScenarioKeys){
			keys = [...keys, ...activeCaseEditedScenarioKeys];
		}
		dispatch(actionRemoveEditedScenarios(keys));
	};
}

function updateEditedActiveCase(key, value) {
	return (dispatch, getState) => {
		let state = getState();
		let activeCaseKey = Select.scenarios.getActiveCaseKey(state);
		let activeCase = Select.scenarios.getActiveCase(state);
		let sameValue = false;

		if (activeCase && activeCase.data){
			if ((key === 'geometry' || key === 'scenarios') && activeCase.data[key]){
				let val = _.cloneDeep(activeCase.data[key]);
				sameValue = JSON.stringify(value) === JSON.stringify(val);
			}

			if (sameValue || (value === activeCase.data[key]) || (!activeCase.data[key] && value.length === 0)){
				dispatch(actionRemovePropertyFromEditedCase(activeCaseKey, key));
			} else {
				dispatch(actionUpdateEditedCases([{key: activeCaseKey, data: {[key]: value}}]));
			}
		} else {
			dispatch(actionUpdateEditedCases([{key: activeCaseKey, data: {[key]: value}}]));
		}
	};
}

function updateEditedScenario(scenarioKey, key, value) {
	return (dispatch, getState) => {
		let scenario = Select.scenarios.getScenario(getState(), scenarioKey);

		// delete property from edited, if the value in update is the same as in state
		if (scenario && (value === scenario.data[key] || (!scenario.data[key] && value.length === 0))){
			dispatch(actionRemovePropertyFromEditedScenario(scenarioKey, key));
		} else {
			dispatch(actionUpdateEditedScenarios([{key: scenarioKey, data: {[key]: value}}]));
		}
	};
}

function setActiveCase(key) {
	return (dispatch, getState) => {
		let previousCase = Select.scenarios.getActiveCaseKey(getState());
		dispatch(actionSetActiveCase(key));
		if (key){
			let scenarios = Select.scenarios.getActiveCaseScenarioKeys(getState());
			if (key !== previousCase){
				dispatch(actionSetActiveKeys(scenarios));
			}
		} else {
			dispatch(actionSetActiveKeys(null));
		}
	}
}

function setDefaultSituationActive(active) {
	return (dispatch, getState) => {
		dispatch(actionSetDefaultSituationActive(active));
	};
}

function addActiveScenario(key){
	return (dispatch, getState) => {
		let activeScenarioKeys = Select.scenarios.getActiveKeys(getState());
		let stateUpdate = _.union(activeScenarioKeys, [key]);
		dispatch(actionSetActiveKeys(stateUpdate));
	}
}

function removeActiveScenario(key){
	return (dispatch, getState) => {
		let activeScenarioKeys = Select.scenarios.getActiveKeys(getState());
		let stateUpdate = _.without(activeScenarioKeys, key);
		dispatch(actionSetActiveKeys(stateUpdate));
	}
}

function applyDataviewSettings(data){
	return (dispatch, getState) => {
		dispatch(setActiveCase(data.cases.activeKey));

		dispatch(load(data.cases.activeKey));

		let state = getState();
		let scenariosState = Select.scenarios.getAll(state);
		let stateUpdate = {...scenariosState,
			activeKeys: data.activeKeys,
			defaultSituationActive: data.defaultSituationActive,
		};
		dispatch(actionUpdate(stateUpdate));
	}
}

function update(data){
	return dispatch => {
		dispatch(actionUpdate(data));
	};
}

function updateCases(data){
	return dispatch => {
		dispatch(actionUpdateCases(data));
	};
}

function load(caseKey, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return (dispatch, getState) => {

		let state = getState();
		if (state.scenarios.loading) {
			// already loading, do nothing
		} else {
			dispatch(actionLoadRequest(caseKey));

			let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata/scenarios');
			let query = queryString.stringify({
				scenario_case_id: caseKey
			});
			if (query) {
				url += '?' + query;
			}

			return fetch(url, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			}).then(
				response => {
					console.log('#### load scenarios response', response);
					let contentType = response.headers.get('Content-type');
					if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
						return response.json().then(data => {
							if (data.data && data.data.scenarios && data.data.scenarios.data) {
								dispatch(loadReceive(data.data.scenarios.data)); //todo cancel loading for caseKey?
								dispatch(scenariosLoadedForActiveCase());
							} else {
								dispatch(actionLoadError('no data returned'));
							}
						});
					} else {
						dispatch(actionLoadError(response))
					}
				},
				error => {
					console.log('#### load scenarios error', error);
					if (ttl - 1) {
						dispatch(load(caseKey, ttl - 1));
					} else {
						dispatch(actionLoadError("scenarios#actions load: scenarios weren't loaded!"));
					}
				}
			);
		}

	};
}

function loadReceive(data) {
	return dispatch => {
		data = _.map(data, ({id, ...model}) => {
			return {...model, key: id};
		});
		dispatch(actionLoadReceive(data));
	};
}

function scenariosLoadedForActiveCase(){
	return (dispatch, getState) => {
		let state = getState();
		let casesState = Select.scenarios.getCasesAll(state);
		let casesData = Select.scenarios.getCases(state);
		let activeCaseKey = Select.scenarios.getActiveCaseKey(state);

		let updatedData = [];
		_.each(casesData, model => {
			if (model.key === activeCaseKey) {
				updatedData.push({...model, scenariosLoaded: true});
			} else {
				updatedData.push(model);
			}
		});
		let stateUpdate = {...casesState, data: updatedData};
		dispatch(updateCases(stateUpdate));
		dispatch(Action.maps.updateWithScenarios());
	};
}

function loadCases(ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return (dispatch, getState) => {

		let state = getState();
		if (state.scenarios.loading) {
			// already loading, do nothing
		} else {
			dispatch(actionLoadCasesRequest());

			let activePlaceKey = Select.places.getActiveKey(state);

			if (activePlaceKey) {

				let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata/scenario_cases');
				let query = queryString.stringify({
					place_id: activePlaceKey
				});
				if (query) {
					url += '?' + query;
				}

				return fetch(url, {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					}
				}).then(
					response => {
						console.log('#### load scenarios cases response', response);
						let contentType = response.headers.get('Content-type');
						if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
							return response.json().then(data => {
								if (data.data && data.data.scenario_cases.data) {
									dispatch(loadCasesReceive(data.data.scenario_cases.data));
								} else {
									dispatch(actionLoadCasesError('no data returned'));
								}
							});
						} else {
							dispatch(actionLoadCasesError(response))
						}
					},
					error => {
						console.log('#### load scenario cases error', error);
						if (ttl - 1) {
							dispatch(loadCases(ttl - 1));
						} else {
							dispatch(actionLoadCasesError("scenarios#actions load cases: cases weren't loaded!"));
						}
					}
				);

			} else {
				dispatch(actionLoadCasesError('scenarios#actions load cases: no active place'));
			}

		}

	};
}

function loadCasesReceive(models) {
	return dispatch => {
		models = _.map(models, ({id, data, ...model}) => {
			let {scenario_ids, ...modelData} = data;
			return {...model, key: id, data: {...modelData, geometry: JSON.parse(modelData.geometry), scenarios: scenario_ids}};
		});
		dispatch(actionLoadCasesReceive(models));
	};
}

function saveActiveCase() {
	return (dispatch, getState) => {
		let state = getState();
		let saved = Select.scenarios.getActiveCase(state);
		let edited = Select.scenarios.getActiveCaseEdited(state);
		let editedScenarios = _.filter(Select.scenarios.getScenariosEdited(state), scenario => {
			let keys = edited ? edited.data.scenarios : saved.data.scenarios;
			return _.includes(keys, scenario.key);
		});
		let activePlaceKey = Select.places.getActiveKey(state);

		if (saved) {
			// update
			dispatch(apiUpdateCases(edited ? [edited] : [], editedScenarios));
		} else {
			// create
			dispatch(apiCreateCases(edited ? [edited] : [], editedScenarios, activePlaceKey));
		}
	};
}


function apiCreateCases(cases, scenarios, placeKey, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return dispatch => {
		dispatch(actionApiCreateCasesRequest(_.map(cases, 'key')));

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata');

		let payload = {
			data: {
				scenario_cases: _.map(cases, model => {
					let caseData = {...model.data, scenario_ids: model.data.scenarios};
					delete caseData.scenarios;
					return {
						uuid: model.key,
						data: {...caseData, place_ids: [placeKey]}
					};
				}),
				scenarios: _.map(scenarios, model => {
					let scenarioData = {...model.data};
					delete scenarioData['file'];

					return {
						uuid: model.key,
						data: {...scenarioData}
					};
				})
			}
		};

		return fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(payload)
		}).then(
			response => {
				console.log('#### create scenario cases response', response);
				let contentType = response.headers.get('Content-type');
				if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
					return response.json().then(data => {
						if (data.data) {
							dispatch(apiCreateCasesReceive(data.data));
							dispatch(apiUploadScenarioFiles(data.data.scenarios));
						} else {
							dispatch(actionApiCreateCasesError('no data returned'));
						}
					});
				} else {
					dispatch(actionApiCreateCasesError(response))
				}
			},
			error => {
				console.log('#### create scenario case error', error);
				if (ttl - 1) {
					dispatch(apiCreateCases(cases, scenarios, placeKey, ttl - 1));
				} else {
					dispatch(actionApiCreateCasesError("scenarios#actions create cases: cases weren't created!"));
				}
			}
		);
	};
}

function apiUpdateCases(updates, editedScenarios, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return dispatch => {
		dispatch(actionApiUpdateCasesRequest(_.map(updates, 'key')));

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata');

		let payload = {
			data: {
				scenario_cases: _.map(updates, model => {
					let caseData = {...model.data, scenario_ids: model.data.scenarios};
					delete caseData.scenarios;
					return {
						id: model.key,
						data: caseData
					};
				}),
				scenarios: _.map(editedScenarios, model => {
					let scenario = {
						data: {...model.data}
					};
					if (typeof model.key === "number"){
						scenario.id = model.key;
					} else {
						scenario.uuid = model.key;
					}

					delete scenario.data['file'];

					return scenario;
				})
			}
		};

		return fetch(url, {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(payload)
		}).then(
			response => {
				console.log('#### update scenario case response', response);
				let contentType = response.headers.get('Content-type');
				if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
					return response.json().then(data => {
						if (data.data) {
							dispatch(apiUpdateCasesReceive(data.data));
							dispatch(apiUploadScenarioFiles(data.data.scenarios));
						} else {
							dispatch(actionApiUpdateCasesError('no data returned'));
						}
					});
				} else {
					dispatch(actionApiUpdateCasesError(response))
				}
			},
			error => {
				console.log('#### update scenario case error', error);
				if (ttl - 1) {
					dispatch(apiUpdateCases(updates, editedScenarios, ttl - 1));
				} else {
					dispatch(actionApiUpdateCasesError("scenarios#actions load cases: cases weren't loaded!"));
				}
			}
		);
	};
}

function apiUploadScenarioFiles(scenarios) {
	return (dispatch) => {
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/importer/upload');

		let promises = [];
		scenarios.forEach((scenario) => {
			if(scenario && scenario.data && scenario.data.file) {
				let postData = new FormData();
				postData.append('file', scenario.data.file);
				promises.push(
					fetch(
						url,
						{
							method: 'POST',
							credentials: 'include',
							body: postData
						}
					).then((response) => response.json())
						.then((response) => {
							return {
								scenarioKey: scenario.key,
								uploadKey: response.data.uploadKey
							}
						})
				)
			}
		});

		if(promises.length) {
			return Promise.all(promises)
				.then((results) => {
					dispatch(apiExecutePucsMatlabProcessOnUploadedScenarioFiles(results));
				});
		}
	}
}

function apiExecutePucsMatlabProcessOnUploadedScenario(uploads) {
	return (dispatch) => {
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/wps');
		let promises = [];

		uploads.forEach((upload) => {
			promises.push(
				fetch(
					url,
					{
						method: 'POST',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/xml',
							'Accept': 'application/xml'
						},
						body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
									<!-- Execute operation request assuming use of default formats, and RawDataOutput.-->
									<!-- Equivalent GET request is
											http://foo.bar/foo?
												Service=WPS&
												Version=1.0.0&
												Language=en-CA&
												Request=Execute&
												Identifier=Buffer&
												DataInputs=[InputPolygon=@xlink:href=http%3A%2F%2Ffoo.bar%2Fsome_WFS_request.xml;BufferDistance=400]&
												RawDataOutput=[BufferedPolygon]-->
									<wps:Execute service="WPS" version="1.0.0" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0/wpsExecute_request.xsd">
										<ows:Identifier>CalculatePragueTemperatureMapUsingNeuralNetworkModel</ows:Identifier>
									<ows:Title>CalculatePragueTemperatureMapUsingNeuralNetworkModel</ows:Title>
									<ows:Abstract>Calculate temperature map for Prague using neural network model by VITO</ows:Abstract>
									<DataInputs>
										<wps:Input>
											<ows:Identifier>inputFile</ows:Identifier>
											<ows:Title>Distance which people will walk to get to a playground.</ows:Title>
											<wps:Data>
												<wps:LiteralData>upload:${upload.uploadKey}</wps:LiteralData>
											</wps:Data>
										</wps:Input>
									</DataInputs>
									</wps:Execute>`
					}
				).then((response) => response.text())
					.then(responseText => (new window.DOMParser()).parseFromString(responseText, "text/xml"))
					.then((responseXml) => {
						let elements = responseXml.getElementsByTagName('LiteralData');
						return {
							scenarioKey: upload.scenarioKey,
							processResults: elements && elements.length ? JSON.parse(elements[0].textContent) : null
						}
					})
			)
		});

		return Promise.all(promises)
			.then((results) => {
				dispatch(apiCreateRelationsForScenarioProcessResults(results));
			});
	}
}

function clearRequestInterval(uuid) {
	if (requestIntervals.hasOwnProperty(uuid)) {
		clearInterval(requestIntervals[uuid]);
	}
}

function apiExecutePucsMatlabProcessOnUploadedScenarioFiles(uploads) {
	return (dispatch) => {
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/pucs/execute_matlab');

		uploads.forEach((upload)=>{
			let uuid = utils.guid();
			let requestAttempt = () => {
				fetch(url, {
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					},
					body: JSON.stringify({
						uploadKey: upload.uploadKey
					})
				}).then((response) => {
					return response.json().then(data => {
						if (data.result){
							clearRequestInterval(uuid);
							dispatch(apiCreateRelationsForScenarioProcessResults([{
								scenarioKey: upload.scenarioKey,
								processResults: JSON.parse(data.result)
							}]));
							console.log('achachach', data.result);
						}
					});
				});
			};

			requestAttempt();
			requestIntervals[uuid] = setInterval(() => {
				requestAttempt();
			}, 5000);
		});
	}
}


function apiCreateRelationsForScenarioProcessResults(results) {
	return (dispatch, getState) => {
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, 'backend/rest/metadata/spatial_relations');

		let activePlace = Select.places.getActive(getState());

		let activePlaceKey = activePlace ? activePlace.key : null;
		let inputVectorTemplateId = 3332;
		let outputRasterHwdTemplateId = 4092;
		let outputRasterUhiTemplateId = 4091;

		let relations = [];
		results.forEach((result) => {
			if(activePlaceKey && result.scenarioKey) {
				let inputVectors = result.processResults[0].inputVectors;
				let outputRasters = result.processResults[0].outputRasters;

				let inputVector = inputVectors[0];
				let outputHwd = _.find(outputRasters, {indicator: 'hwd'});
				let outputUhi = _.find(outputRasters, {indicator: 'uhi'});

				if(inputVector && outputHwd && outputUhi) {
					relations.push(
						{
							data: {
								place_id: Number(activePlaceKey),
								scenario_id: Number(result.scenarioKey),
								layer_template_id: inputVectorTemplateId,
								data_source_id: inputVector.spatialDataSourceId
							}
						}
					);
					relations.push(
						{
							data: {
								place_id: Number(activePlaceKey),
								scenario_id: Number(result.scenarioKey),
								layer_template_id: outputRasterHwdTemplateId,
								data_source_id: outputHwd.spatialDataSourceId
							}
						}
					);
					relations.push(
						{
							data: {
								place_id: Number(activePlaceKey),
								scenario_id: Number(result.scenarioKey),
								layer_template_id: outputRasterUhiTemplateId,
								data_source_id: outputUhi.spatialDataSourceId
							}
						}
					)
				}
			}
		});

		if(relations.length) {
			return fetch(url, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify(relations)
			}).then((relationResults) => relationResults.json())
				.then((relationResults) => {
				});
		}
	}
}

function apiCreateCasesReceive(data) {
	return (dispatch, getState) => {
		let cases = data.scenario_cases;
		let scenarios = data.scenarios;

		// add to data
		dispatch(loadCasesReceive(cases));
		dispatch(apiCreateScenariosReceive(scenarios));

		// change active key if of temporary case
		let activeCaseKey = Select.scenarios.getActiveCaseKey(getState());
		if (activeCaseKey) {
			let activeCaseCreated = _.find(cases, {uuid: activeCaseKey});
			if (activeCaseCreated) {
				dispatch(actionSetActiveCase(activeCaseCreated.id));
			}
		}
		// remove from editedData
		dispatch(actionRemoveEditedCases(_.map(cases, 'uuid')));
	};
}

function apiUpdateCasesReceive(data) {
	return dispatch => {
		let cases = data.scenario_cases;
		let scenarios = data.scenarios;

		if (scenarios.length){
			// remove from editedData
			dispatch(removeActiveCaseEditedScenarios());
			// add/update data
			dispatch(loadReceive(scenarios));
		}

		dispatch(loadCasesReceive(cases));
		dispatch(removeEditedActiveCase());
	};
}

function apiCreateScenariosReceive(data) {
	return (dispatch, getState) => {

		// add to data
		dispatch(loadReceive(data));

		// change keys in (edited) cases
		let editedCases = Select.scenarios.getCasesEdited(getState());
		let updates = [];
		_.each(editedCases, editedCase => {
			let scenariosChanged;
			let newScenarios = _.map(editedCase.data.scenarios, scenarioKey => {
				let createdScenario = _.find(data, {'uuid': scenarioKey});
				if (createdScenario) {
					scenariosChanged = true;
					return createdScenario.id;
				} else {
					return scenarioKey;
				}
			});
			if (scenariosChanged) {
				updates.push({
					key: editedCase.key,
					data: {'scenarios': newScenarios}
				});
			}
		});
		if (updates.length) {
			dispatch(actionUpdateEditedCases(updates));
		}

		// remove from editedData
		dispatch(removeActiveCaseEditedScenarios());
	};
}

// ============ actions ===========

function actionAdd(scenarios) {
	return {
		type: ActionTypes.SCENARIOS_ADD,
		data: scenarios
	}
}

function actionSetActive(scenario) {
	return {
		type: ActionTypes.SCENARIOS_SET_ACTIVE,
		data: scenario
	}
}

function actionSetActiveKeys(scenarios) {
	return {
		type: ActionTypes.SCENARIOS_SET_ACTIVE_MULTI,
		keys: scenarios
	}
}

function actionSetActiveCase(caseKey) {
	return {
		type: ActionTypes.SCENARIOS_CASES_SET_ACTIVE,
		key: caseKey
	}
}

function actionSetDefaultSituationActive(active) {
	return {
		type: ActionTypes.SCENARIOS_SET_DEFAULT_SITUATION_ACTIVE,
		active: active
	}
}

function actionUpdate(data) {
	return {
		type: ActionTypes.SCENARIOS_UPDATE,
		data: data
	}
}

function actionUpdateCases(data) {
	return {
		type: ActionTypes.SCENARIOS_CASES_UPDATE,
		data: data
	}
}

function actionLoadRequest(caseKey) {
	return {
		type: ActionTypes.SCENARIOS_REQUEST,
		caseKey: caseKey
	}
}

function actionLoadReceive(data) {
	return {
		type: ActionTypes.SCENARIOS_RECEIVE,
		data: data
	}
}

function actionLoadError(error) {
	return {
		type: ActionTypes.SCENARIOS_REQUEST_ERROR,
		error: error
	}
}

function actionLoadCasesRequest() {
	return {
		type: ActionTypes.SCENARIOS_CASES_REQUEST
	}
}

function actionLoadCasesReceive(data) {
	return {
		type: ActionTypes.SCENARIOS_CASES_RECEIVE,
		data: data
	}
}

function actionLoadCasesError(error) {
	return {
		type: ActionTypes.SCENARIOS_CASES_REQUEST_ERROR,
		error: error
	}
}

function actionUpdateEditedCases(data) {
	return {
		type: ActionTypes.SCENARIOS_CASES_EDITED_UPDATE,
		data: data
	}
}
function actionUpdateEditedScenarios(data) {
	return {
		type: ActionTypes.SCENARIOS_EDITED_UPDATE,
		data: data
	}
}
function actionRemoveEditedCases(keys) {
	return {
		type: ActionTypes.SCENARIOS_CASES_EDITED_REMOVE,
		keys: keys
	}
}
function actionRemovePropertyFromEditedCase(caseKey, property) {
	return {
		type: ActionTypes.SCENARIOS_CASE_EDITED_REMOVE_PROPERTY,
		caseKey: caseKey,
		property: property
	}
}
function actionRemoveEditedScenarios(keys) {
	return {
		type: ActionTypes.SCENARIOS_EDITED_REMOVE,
		keys: keys
	}
}

function actionRemovePropertyFromEditedScenario(scenarioKey, property) {
	return {
		type: ActionTypes.SCENARIOS_EDITED_REMOVE_PROPERTY,
		scenarioKey: scenarioKey,
		property: property
	}
}

function actionApiCreateCasesRequest(keys) {
	return {
		type: ActionTypes.SCENARIOS_CASES_API_CREATE_REQUEST,
		keys: keys
	}
}

function actionApiCreateCasesError(error) {
	return {
		type: ActionTypes.SCENARIOS_CASES_API_CREATE_ERROR,
		error: error
	}
}

function actionApiUpdateCasesRequest(keys) {
	return {
		type: ActionTypes.SCENARIOS_CASES_API_UPDATE_REQUEST,
		keys: keys
	}
}

function actionApiUpdateCasesError(keys) {
	return {
		type: ActionTypes.SCENARIOS_CASES_API_UPDATE_ERROR,
		keys: keys
	}
}

// ============ export ===========

export default {
	add: add,
	setActive: setActive,
	update: update,

	applyDataviewSettings: applyDataviewSettings,
	setDefaultSituationActive: setDefaultSituationActive,

	addActiveScenario: addActiveScenario,
	removeActiveScenario: removeActiveScenario,

	saveActiveCase: saveActiveCase,
	setActiveCase: setActiveCase,

	load: load,
	loadCases: loadCases,

	addEditedScenario: addEditedScenario,
	removeActiveCaseEditedScenarios: removeActiveCaseEditedScenarios,
	removeEditedActiveCase: removeEditedActiveCase,

	updateEditedActiveCase: updateEditedActiveCase,
	updateEditedScenario: updateEditedScenario
}

