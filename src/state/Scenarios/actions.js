import Action from '../Action';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import config from '../../config';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';
import queryString from 'query-string';
import {utils} from '@gisatcz/ptr-utils'

import common from '../_common/actions';

let requestIntervals = {};

const TTL = 5;

// ============ creators ===========

const add = common.add(ActionTypes.SCENARIOS);

// Edited data
function addEditedScenario(key, options){
	return (dispatch, getState) => {
		let activeCaseScenarioKeys = Select.scenarios.cases.getActiveCaseScenarioKeys(getState());
		let activeCaseEditedScenarioKeys = Select.scenarios.cases.getActiveCaseEditedScenarioKeys(getState());
		let updatedScenarioKeys = activeCaseEditedScenarioKeys ? [...activeCaseEditedScenarioKeys, ...[key]] :
			(activeCaseScenarioKeys ? [...activeCaseScenarioKeys, ...[key]] : [key] );
		dispatch(actionUpdateEditedScenarios([{key: key, ...options}]));
		dispatch(updateEditedActiveCase('scenarios', updatedScenarioKeys));
	};
}

/**
 * It removes edited scenarios for active case
 */
function removeActiveCaseEditedScenarios() {
	return (dispatch, getState) => {
		let activeCaseScenarioKeys = Select.scenarios.cases.getActiveCaseScenarioKeys(getState());
		let activeCaseEditedScenarioKeys = Select.scenarios.cases.getActiveCaseEditedScenarioKeys(getState());
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
		let activeCaseKey = Select.scenarios.cases.getActiveKey(state);
		let activeCase = Select.scenarios.cases.getActive(state);
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

// it just remove scenario from active case (if it isn't last). Todo unlinking and delete scenario
function removeScenarioFromActiveCase (scenarioKey) {
	return ((dispatch, getState) => {
		let activeCase = Select.scenarios.cases.getActive(getState());

		if (activeCase && activeCase.data && activeCase.data.scenarios){
			let updatedScenarios = _.without(activeCase.data.scenarios, scenarioKey);
			let updatedCase = {...activeCase, data: {...activeCase.data, scenarios: updatedScenarios}};

			dispatch(removeActiveScenario(scenarioKey));
			dispatch(apiUpdateCases([updatedCase],[]));
		}
	});
}

function removeScenarioFromActiveCaseEdited (scenarioKey) {
	return ((dispatch, getState) => {
		let activeCaseEdited = Select.scenarios.cases.getActiveCaseEdited(getState());

		if (activeCaseEdited && activeCaseEdited.data && activeCaseEdited.data.scenarios){
			let updatedScenarios = _.without(activeCaseEdited.data.scenarios, scenarioKey);
			dispatch(updateEditedActiveCase('scenarios', updatedScenarios));
		}
	});
}

function updateEditedScenario(scenarioKey, key, value) {
	return (dispatch, getState) => {
		let state = getState();
		let scenario = Select.scenarios.scenarios.getByKey(state, scenarioKey);
		let activeCaseKey = Select.scenarios.cases.getActiveKey(state);
		let activeCaseScenarioKeys = Select.scenarios.cases.getActiveCaseScenarioKeys(state);
		let activeCaseEditedScenarioKeys = Select.scenarios.cases.getActiveCaseEditedScenarioKeys(state);

		let updatedScenarioKeys = [];
		if (activeCaseScenarioKeys){
			updatedScenarioKeys = _.union(updatedScenarioKeys, activeCaseScenarioKeys);
		}
		if (activeCaseEditedScenarioKeys){
			updatedScenarioKeys = _.union(updatedScenarioKeys, activeCaseEditedScenarioKeys);
		}

		// delete property from edited, if the value in update is the same as in state
		if (scenario && (value === scenario.data[key] || (!scenario.data[key] && value.length === 0))){
			dispatch(actionRemovePropertyFromEditedScenario(scenarioKey, key));
		} else {
			dispatch(actionUpdateEditedCases([{key: activeCaseKey, data: {scenarios: updatedScenarioKeys}}]));
			dispatch(actionUpdateEditedScenarios([{key: scenarioKey, data: {[key]: value}}]));
		}
	};
}

function setActiveCase(key) {
	return (dispatch, getState) => {
		let previousCase = Select.scenarios.cases.getActiveKey(getState());
		dispatch(actionSetActiveCase(key));
		if (key){
			let scenarios = Select.scenarios.cases.getActiveCaseScenarioKeys(getState());
			if (key !== previousCase){
				dispatch(actionSetActiveKeys(scenarios));
			}
		} else {
			dispatch(actionSetActiveKeys(null));
		}
	}
}

function addActiveScenario(key){
	return (dispatch, getState) => {
		let activeScenarioKeys = Select.scenarios.scenarios.getActiveKeys(getState());
		let stateUpdate = _.union(activeScenarioKeys, [key]);
		dispatch(actionSetActiveKeys(stateUpdate));
	}
}

function removeActiveScenario(key){
	return (dispatch, getState) => {
		let activeScenarioKeys = Select.scenarios.scenarios.getActiveKeys(getState());
		let stateUpdate = _.without(activeScenarioKeys, key);
		dispatch(actionSetActiveKeys(stateUpdate));
	}
}

function applyDataviewSettings(data){
	return (dispatch, getState) => {
		dispatch(setActiveCase(data.cases.activeKey));
		dispatch(load(data.cases.activeKey));

		dispatch(actionSetActiveKeys(data.scenarios.activeKeys));
		dispatch(actionSetDefaultSituationActive(data.scenarios.defaultSituationActive));
	}
}

function updateCases(data){
	return dispatch => {
		dispatch(actionUpdateCases(data));
	};
}

function removeCases(keys){
	return (dispatch, getState) => {
		dispatch(actionRemoveCases(keys));
	};
}

function load(caseKey) {
	return (dispatch, getState) => {
		let state = getState();
		if (state.scenarios.loading) {
			// already loading, do nothing
		} else {
			dispatch(actionLoadRequest(caseKey));
			let query = {
				scenario_case_id: caseKey
			};
			dispatch(common.request('backend/rest/metadata/scenarios', "GET", query, null, loadReceive, actionLoadError));
		}
	}
}

function loadReceive(data) {
	//todo cancel loading for caseKey?
	data = data.scenarios ? data.scenarios : data;

	return dispatch => {
		if (data){
			data = _.map(data, ({id, ...model}) => {
				return {...model, key: id};
			});
			dispatch(actionLoadReceive(data));
			dispatch(scenariosLoadedForActiveCase());
		} else {
			console.error("Scenarios actions#loadReceive: No scenarios loaded")
			// TODO
		}
	};
}

function scenariosLoadedForActiveCase(){
	return (dispatch, getState) => {
		let activeCase = Select.scenarios.cases.getActive(getState());
		if (activeCase){
			let updatedCase = {...activeCase, data: {...activeCase.data, scenariosLoaded: true}};
			dispatch(updateCases([updatedCase]));
			dispatch(Action.maps.updateWithScenarios());
		}
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

				let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendPath, 'backend/rest/metadata/scenario_cases');
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
								if (data.data && data.data.scenario_cases) {
									dispatch(loadCasesReceive(data.data.scenario_cases));
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
		let saved = Select.scenarios.cases.getActive(state);
		let edited = Select.scenarios.cases.getActiveCaseEdited(state);
		let editedScenarios = _.filter(Select.scenarios.scenarios.getEditedAll(state), scenario => {
			let keys = edited && edited.data && edited.data.scenarios ? edited.data.scenarios : saved.data.scenarios;
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

function deleteActiveCase() {
	return (dispatch, getState) => {
		let state = getState();
		let activeCase = Select.scenarios.cases.getActive(state);
		if (activeCase){
			dispatch(apiDeleteCases([activeCase]));
		}
	};
}

function apiCreateCases(cases, scenarios, placeKey, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return dispatch => {
		dispatch(actionApiCreateCasesRequest(_.map(cases, 'key')));

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendPath, 'backend/rest/metadata');

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

							let uploadedScenarioFiles = [];

							_.each(data.data.scenarios, createdScenario => {
								let scenarioToCreate = _.find(scenarios, {key: createdScenario.uuid});
								if (scenarioToCreate) {
									uploadedScenarioFiles.push(
										{
											key: createdScenario.id,
											data: scenarioToCreate.data
										}
									)
								}
							});

							dispatch(apiUploadScenarioFiles(uploadedScenarioFiles));
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
	return (dispatch, getState) => {
		dispatch(actionApiUpdateCasesRequest(_.map(updates, 'key')));

		let state = getState();

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendPath, 'backend/rest/metadata');

		let payload = {
			data: {
				scenario_cases: _.map(updates, model => {
					let caseData = {...model.data, scenario_ids: model.data.scenarios};
					delete caseData.scenarios;
					if (caseData.scenariosLoaded){
						delete caseData.scenariosLoaded;
					}
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
				let contentType = response.headers.get('Content-type');
				if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
					return response.json().then(data => {
						if (data.data) {
							dispatch(apiUpdateCasesReceive(data.data));

							let uploadedScenarioFiles = [];
							let duplicatedScenarios = [];

							_.each(data.data.scenarios, createdScenario => {
								let scenarioToCreate = _.find(editedScenarios, {key: createdScenario.uuid || createdScenario.id});
								if (scenarioToCreate && scenarioToCreate.data.file) {
									uploadedScenarioFiles.push(
										{
											key: createdScenario.id,
											data: scenarioToCreate.data
										}
									)
								} else if(scenarioToCreate && scenarioToCreate.dataSourceCloneKey) {
									let clonedDataSource = Select.spatialDataSources.getDataSource(getState(), scenarioToCreate.dataSourceCloneKey);
									duplicatedScenarios.push(
										{
											key: createdScenario.id,
											layerName: clonedDataSource.data.layer_name,
											data: scenarioToCreate.data
										}
									)
								}
							});

							if(uploadedScenarioFiles.length) {
								dispatch(apiUploadScenarioFiles(uploadedScenarioFiles));
							}
							if(duplicatedScenarios.length) {
								dispatch(apiExecuteMultipleMatlabProcessAndPublisResults(_.map(duplicatedScenarios, duplicatedScenario => {
									return {
										scenario_id: duplicatedScenario.key,
										scope_id: Select.scopes.getActiveScopeKey(state),
										place_id: Select.places.getActiveKey(state),
										localLayer: duplicatedScenario.layerName
									}
								})));
							}
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

function apiDeleteCases(cases, ttl) {
	if (_.isUndefined(ttl)) ttl = TTL;
	return dispatch => {
		dispatch(actionApiDeleteCasesRequest(_.map(cases, 'key')));

		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendPath, 'backend/rest/metadata');

		let payload = {
			data: {
				scenario_cases: _.map(cases, model => {
					return {
						id: model.key
					};
				})
			}
		};

		return fetch(url, {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(payload)
		}).then(
			response => {
				console.log('#### delete scenario case response', response);
				let contentType = response.headers.get('Content-type');
				if (response.ok && contentType && (contentType.indexOf('application/json') !== -1)) {
					return response.json().then(data => {
						if (data && data.data && data.data.scenario_cases) {
							let caseKeys = [];
							data.data.scenario_cases.map(scenarioCase => {
								if (scenarioCase.deleted){
									caseKeys.push(scenarioCase.id);
								}
							});
							dispatch(removeCases(caseKeys));
						} else {
							dispatch(apiDeleteCasesError('no data about scenario cases returned'));
						}
					});
				} else {
					dispatch(apiDeleteCasesError(response))
				}
			},
			error => {
				console.log('#### delete scenario case error', error);
				if (ttl - 1) {
					dispatch(apiDeleteCases(cases, ttl - 1));
				} else {
					dispatch(apiDeleteCasesError("scenarios#actions load cases: cases weren't loaded!"));
				}
			}
		);
	};
}

function apiDeleteCasesError(message){
	return (dispatch) => {
		dispatch(actionApiDeleteCasesError(message))
	}
}

function apiUploadScenarioFiles(scenarios) {
	return (dispatch) => {
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendPath, 'backend/rest/importer/upload');

		let promises = [];
		let scenarioKeys = [];
		scenarios.forEach((scenario) => {
			if(scenario && scenario.data && scenario.data.file) {
				dispatch(apiProcessingScenarioFileStarted(scenario.key));
				scenarioKeys.push(scenario.key);
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
					).then((response) => response.json(), error => {dispatch(apiProcessingScenarioFileError(scenario.key, error));})
						.then((response) => {
							return {
								scenarioKey: scenario.key,
								uploadKey: response.data.uploadKey
							}
						}).catch(error => {dispatch(apiProcessingScenarioFileError(scenario.key, error));})
				)
			}
		});

		if(promises.length) {
			return Promise.all(promises)
				.then((results) => {
					dispatch(apiExecutePucsMatlabProcessOnUploadedScenarioFiles(results));
				}).catch(error => {dispatch(apiProcessingScenarioFilesError(scenarioKeys, error));});
		}
	}
}

function clearRequestInterval(uuid) {
	if (requestIntervals.hasOwnProperty(uuid)) {
		clearInterval(requestIntervals[uuid]);
	}
}

function apiExecuteMultipleMatlabProcessAndPublisResults(processes) {
	return (dispatch) => {
		processes = _.isArray(processes) ? processes : [processes];

		processes.forEach((process) => {
			if(process.scenario_id) {
				dispatch(apiProcessingScenarioFileStarted(process.scenario_id));
			}
		});

		getBodyForMatlabProcessesRequest(processes)
			.then((body) => {
				let execute = () => {
					executeMatlabProcessRequest(body)
						.then((results) => {
							return processMatlabProcessRequestResults(results, dispatch);
						})
						.then((repeat) => {
							if(repeat) {
								setTimeout(() => {
									execute();
								}, 2000);
							}
						})
						.catch((error) => {
							console.log(`apiExecuteMultipleMatlabProcessAndPublisResults#error`, error);
						});
				};
				execute();
			});
	}
}

function processMatlabProcessRequestResults(results, dispatch) {
	return Promise.resolve()
		.then(() => {
			let running = false;

			results.data.forEach((resultData) => {
				if (resultData.status === "running") {
					running = true;
				}
			});

			if (!running) {
				let dataSourcesIds = [];
				results.data.forEach((resultData) => {
					if (resultData.status === "done" && resultData["spatial_relations"]) {
						_.each(resultData['spatial_relations'], (relation) => {
							dataSourcesIds.push(relation.data.data_source_id);
						});
						dispatch(Action.spatialRelations.loadRelationsReceive(resultData['spatial_relations']));
						dispatch(apiProcessingScenarioFileSuccess(resultData.data.scenario_id));
					}
				});
				dispatch(Action.spatialDataSources.loadFiltered({'id': dataSourcesIds}));
			} else {
				return running;
			}
		});
}

function executeMatlabProcessRequest(body) {
	return fetch(
		config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendPath, 'backend/rest/pucs/publish'),
		{
			method: "POST",
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(body)
		}
	).then((response) => {
		if (response.status === 200) {
			return response.json();
		} else {
			throw new Error('wrong status');
		}
	})
}

function getBodyForMatlabProcessesRequest(processes) {
	return Promise.resolve()
		.then(() => {
			return {
				data: _.map(processes, (process) => {
					return {
						uuid: utils.uuid(),
						data: process
					}
				})
			};
		});
}

function apiExecutePucsMatlabProcessOnUploadedScenarioFiles(uploads) {
	return (dispatch, getState) => {
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendPath, 'backend/rest/pucs/execute_matlab');
		let state = getState();

		let scenarioKeys = [];
		uploads.forEach((upload) => {
			scenarioKeys.push(upload.scenarioKey);
			let uuid = utils.uuid();
			let requestAttempt = () => {
				fetch(url, {
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					},
					body: JSON.stringify({
						data: {
							uploadKey: upload.uploadKey,
							placeId: Select.places.getActiveKey(state),
							scopeId: Select.scopes.getActiveScopeKey(state)
						}
					})
				}).then((response) => {
					return response.json().then(data => {
						if(!response.ok || (data.hasOwnProperty('success') && !data.success)) {
							clearRequestInterval(uuid);
							dispatch(apiProcessingScenarioFilesError(scenarioKeys, response.statusText));
						} else if (data.result) {
							clearRequestInterval(uuid);
							dispatch(apiCreateRelationsForScenarioProcessResults([{
								scenarioKey: upload.scenarioKey,
								processResults: JSON.parse(data.result)
							}]));
						}
					}).catch(error => {
						clearRequestInterval(uuid);
						dispatch(apiProcessingScenarioFilesError(scenarioKeys, error));
					});
				}).catch(error => {
					clearRequestInterval(uuid);
					dispatch(apiProcessingScenarioFilesError(scenarioKeys, error));
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
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendPath, 'backend/rest/relations');

		let activePlace = Select.places.getActive(getState());

		let activePlaceKey = activePlace ? activePlace.key : null;

		let inputVectorTemplateId, outputRasterHwdTemplateId, outputRasterUhiTemplateId;
		let configuration = Select.scopes.getActiveScopeConfiguration(getState());
		if (configuration.pucsLandUseScenarios && configuration.pucsLandUseScenarios.templates){
			let templates = configuration.pucsLandUseScenarios.templates;
			inputVectorTemplateId = templates.sourceVector;
			outputRasterHwdTemplateId = templates.hwd;
			outputRasterUhiTemplateId = templates.uhi;
		} else {
			console.error("Scenarios actions#apiCreateRelationsForScenarioProcessResults: pucsLandUseScenarios configuration is missing!")
		}

		let relations = [];
		let scenarioKeys = [];

		results.forEach((result) => {
			if(activePlaceKey && result.scenarioKey) {
				scenarioKeys.push(result.scenarioKey);
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
				body: JSON.stringify({"data": {"spatial": relations}})
			}).then((relationResults) => relationResults.json())
				.then((relationResults) => {
					if (relationResults.data.spatial){
						// todo why there are data apart of key, while in Action.spatialRelations.load response are not?
						let dataSourcesIds = _.compact(
							_.map(relationResults.data.spatial, (spatialRelation) => {
								return spatialRelation.data.data_source_id;
							})
						);
						dispatch(Action.spatialRelations.loadRelationsReceive(relationResults.data.spatial));
						dispatch(Action.spatialDataSources.loadFiltered({'id': dataSourcesIds}));

						dispatch(apiProcessingScenarioFilesSuccess(scenarioKeys));
					} else {
						dispatch(apiProcessingScenarioFilesError(scenarioKeys, "Relations were not loaded"));
					}
				}).catch((error) => {
					dispatch(apiProcessingScenarioFilesError(scenarioKeys, error));
				});
		}
	}
}

function apiProcessingScenarioFileStarted(scenarioKey){
	return (dispatch, getState) => {
		let scenario = Select.scenarios.scenarios.getByKey(getState(), scenarioKey);
		if (scenario){
			let updated = {...scenario, fileProcessing: {started: true}};
			dispatch(actionApiProcessingScenarioFileStarted([updated]));
		}
	};
}

function apiProcessingScenarioFilesSuccess(scenarioKeys){
	return (dispatch, getState) => {
		scenarioKeys.forEach(key => {
			dispatch(apiProcessingScenarioFileSuccess(key));
		});
	};
}

function apiProcessingScenarioFilesError(scenarioKeys, message){
	return (dispatch, getState) => {
		scenarioKeys.forEach(key => {
			dispatch(apiProcessingScenarioFileError(key, message));
		});
	};
}

function apiProcessingScenarioFileSuccess(scenarioKey){
	return (dispatch, getState) => {
		let scenario = Select.scenarios.scenarios.getByKey(getState(), scenarioKey);
		if (scenario){
			let updated = {...scenario, fileProcessing: {started: true, finished: true}};
			dispatch(actionApiProcessingScenarioFileSuccess([updated]));
		}
	};
}

function apiProcessingScenarioFileError(scenarioKey, error){
	return (dispatch, getState) => {
		let scenario = Select.scenarios.scenarios.getByKey(getState(), scenarioKey);
		if (scenario){
			let updated = {...scenario, fileProcessing: {started: true, finished: true, error: true, message: error}};
			dispatch(actionApiProcessingScenarioFileError([updated]));
			console.error('Scenarios/actions#apiProcessingScenarioFileError', error);
		}
	};
}

function apiCreateCasesReceive(data) {
	return (dispatch, getState) => {
		let cases = data.scenario_cases;
		let scenarios = data.scenarios;

		// add to data
		dispatch(loadCasesReceive(cases));
		dispatch(apiCreateScenariosReceive(scenarios));

		// change active key if of temporary case
		let activeCaseKey = Select.scenarios.cases.getActiveKey(getState());
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
		dispatch(actionRemoveActiveCaseFromEdited());
	};
}

function apiCreateScenariosReceive(data) {
	return (dispatch, getState) => {

		// add to data
		dispatch(loadReceive(data));

		// change keys in (edited) cases
		let editedCases = Select.scenarios.cases.getEditedAll(getState());
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
function actionRemoveActiveCaseFromEdited() {
	return {
		type: ActionTypes.SCENARIOS_CASES_EDITED_REMOVE_ACTIVE,
	}
}
function actionRemoveCases(keys) {
	return {
		type: ActionTypes.SCENARIOS_CASES_REMOVE,
		keys: keys
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
		type: ActionTypes.SCENARIOS_CASES_EDITED_REMOVE_PROPERTY,
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

function actionApiDeleteCasesRequest(keys) {
	return {
		type: ActionTypes.SCENARIOS_CASES_API_DELETE_REQUEST,
		keys: keys
	}
}

function actionApiDeleteCasesError(error) {
	return {
		type: ActionTypes.SCENARIOS_CASES_API_DELETE_REQUEST,
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

function actionApiProcessingScenarioFileStarted(data) {
	return {
		type: ActionTypes.SCENARIOS_API_PROCESSING_FILE_STARTED,
		data: data,
	}
}

function actionApiProcessingScenarioFileSuccess(data) {
	return {
		type: ActionTypes.SCENARIOS_API_PROCESSING_FILE_SUCCESS,
		data: data,
	}
}

function actionApiProcessingScenarioFileError(data) {
	return {
		type: ActionTypes.SCENARIOS_API_PROCESSING_FILE_ERROR,
		data: data,
	}
}

// ============ export ===========

export default {
	add: add,
	setActive: actionSetActive,
	removeEditedActiveCase: actionRemoveActiveCaseFromEdited,

	applyDataviewSettings: applyDataviewSettings,
	setDefaultSituationActive: actionSetDefaultSituationActive,

	addActiveScenario: addActiveScenario,
	removeActiveScenario: removeActiveScenario,

	deleteActiveCase: deleteActiveCase,
	saveActiveCase: saveActiveCase,
	setActiveCase: setActiveCase,

	load: load,
	loadCases: loadCases,

	addEditedScenario: addEditedScenario,
	removeActiveCaseEditedScenarios: removeActiveCaseEditedScenarios,

	removeScenarioFromActiveCase: removeScenarioFromActiveCase,
	removeScenarioFromActiveCaseEdited: removeScenarioFromActiveCaseEdited,

	updateEditedActiveCase: updateEditedActiveCase,
	updateEditedScenario: updateEditedScenario
}

