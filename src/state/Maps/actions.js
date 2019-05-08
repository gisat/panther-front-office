import _ from 'lodash';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../../state/Select';
import commonActions from '../_common/actions';
import utils from '../../utils/utils';
import * as layerTreeUtils from '../../utils/layerTreeUtils';
import Action from "../Action";

const {actionGeneralError} = commonActions;

// ============ creators ===========
const useClear = (mapKey) => {
	return (dispatch) => {
		dispatch(commonActions.useIndexedClear(ActionTypes.SPATIAL_RELATIONS)(`map_${mapKey}`));
	};
};

const setActiveMapKey = (mapKey) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(mapByKey) {
			const activeMapKey = Select.maps.getActiveMapKey(state);
			if(mapKey !== activeMapKey) {
				dispatch(actionSetActiveMapKey(mapKey));
				const setByMapKey = Select.maps.getMapSetByMapKey(state, mapKey);
				if(setByMapKey) {
					dispatch(setActiveSetKey(setByMapKey.key));
				}
			}
		} else {
			return dispatch(actionGeneralError(`Can not set mapKey ${mapKey} as active, because map with this key dont exists.`));
		}
	};
};

const setActiveSetKey = (setKey) => {
	return (dispatch, getState) => {
		const state = getState();
		const setByKey = Select.maps.getMapSetByKey(state, setKey);
		if(setByKey) {
			const activeSetKey = Select.maps.getActiveSetKey(state);
			if(setKey !== activeSetKey) {
				return dispatch(actionSetActiveSetKey(setKey));
			}
		} else {
			return dispatch(actionGeneralError(`Can not set setKey ${setKey} as active, because set with this key dont exists.`));
		}
	};
};

const addSet = (set) => {
	return (dispatch, getState) => {
		const state = getState();
		const setKey = set.key;
		if(!setKey) {
			return dispatch(actionGeneralError(`Undefined setKey for set ${set}`));
		} else {
			const setByKey = Select.maps.getMapSetByKey(state, setKey);
			if(setByKey) {
				return dispatch(actionGeneralError(`Set with given setKey (${setKey}) already exists ${setByKey}`));
			} else {
				dispatch(actionAddSet(set));
				//if no set is active, set set as active
				const activeSetKey = Select.maps.getActiveSetKey(state);
				if(!activeSetKey) {
					dispatch(actionSetActiveSetKey(setKey));
				}
			}
		}

	};
};

/**
 * {Object} layerTreesFilter
 * {Array} mapKeys
 */
const loadLayerTreesData = (layerTreesFilter, mapKeys) => {
	return (dispatch, getState) => {
		const state = getState();
		// getIndexed
		const layerTreesData = Select.layersTrees.getByFilterOrder(state, layerTreesFilter, null);
		
		if(layerTreesData) {
			//BE should return only one record, but could be bore fore scopeKey and applicationKey. 
			//Take last record
			const lastLTdata = layerTreesData[layerTreesData.length - 1];
			
			//parse to map state
			if(lastLTdata && lastLTdata.data && lastLTdata.data.structure && lastLTdata.data.structure.length > 0) {
				const layerTreeStructure = lastLTdata.data.structure;
	
				dispatch(addTreeLayers(layerTreeStructure, 'layers', mapKeys));
				dispatch(addTreeLayers(layerTreeStructure, 'backgroundLayers', mapKeys));
			}
		}
	}
}

const addTreeLayers = (treeLayers, layerTreeBranchKey, mapKeys) => {
	return (dispatch) => {
		//no array but object
		const flattenLT = layerTreeUtils.getFlattenLayers(treeLayers[0][layerTreeBranchKey]);
		const visibleLayers = flattenLT.filter((l) => l.visible);
		//add all visible layers in layerTree to map
		const visibleLayersKeys = visibleLayers.map(l => l.key);


		if(mapKeys) {
			mapKeys.forEach((mapKey) => {
				visibleLayersKeys.forEach((layerKey) => {
					const zIndex = layerTreeUtils.getLayerZindex(treeLayers[0], layerKey);
					const layer = {layerTemplate: layerKey};

					switch (layerTreeBranchKey) {
						case 'backgroundLayers':
							return dispatch(setMapBackgroundLayer(mapKey, layer, zIndex));
						case 'layers':
							return dispatch(addLayer(mapKey, layer, zIndex));
						default:
							return dispatch(addLayer(mapKey, layer, zIndex));
					}
				}) 
			})
		}
	}
};

const removeSet = (setKey) => {
	return (dispatch, getState) => {
		const state = getState();
		const setByKey = Select.maps.getMapSetByKey(state, setKey);
		if(!setByKey) {
			return dispatch(actionGeneralError(`No set found for setKey ${setKey}.`));
		} else {
			return dispatch(actionRemoveSet(setKey));
		}
	};
};

const addMapToSet = (setKey, mapKey) => {
	return (dispatch, getState) => {
		const state = getState();
		const setByKey = Select.maps.getMapSetByKey(state, setKey);
		if(!setByKey) {
			return dispatch(actionGeneralError(`No set found for setKey ${setKey}.`));
		} else {
			//check map exist
			if (setByKey.maps && setByKey.maps.includes(mapKey)) {
				return dispatch(actionGeneralError(`Set ${setKey} alredy contains map ${mapKey}.`));
			} else {
				dispatch(actionAddMapToSet(setKey, mapKey));
				//if no map is active, set map as active
				const activeMapKey = Select.maps.getActiveMapKey(state);
				if(!activeMapKey) {
					dispatch(actionSetActiveMapKey(mapKey));
				}
				
			}
		}
	};
};

const removeMapKeyFromSet = (setKey, mapKey) => {
	return (dispatch, getState) => {
		const state = getState();
		const setByKey = Select.maps.getMapSetByKey(state, setKey);
		if(!setByKey) {
			return dispatch(actionGeneralError(`No set found for setKey ${setKey}.`));
		} else {
			//check map exist
			if (setByKey.maps && setByKey.maps.includes(mapKey)) {
				return dispatch(actionRemoveMapKeyFromSet(setKey, mapKey));
			} else {
				return dispatch(actionGeneralError(`Set ${setKey} do not contains map ${mapKey}.`));
			}
		}
	}
};

const setSetWorldWindNavigator = (setKey, worldWindNavigator) => {
	return (dispatch, getState) => {
		const state = getState();
		const setByKey = Select.maps.getMapSetByKey(state, setKey);
		if(!setByKey) {
			return dispatch(actionGeneralError(`No set found for setKey ${setKey}.`));
		} else {
			return dispatch(actionSetSetWorldWindNavigator(setKey, worldWindNavigator));
		}
	}
};

const setSetSync = (setKey, sync) => {
	return (dispatch, getState) => {
		const state = getState();
		const setByKey = Select.maps.getMapSetByKey(state, setKey);
		if(!setByKey) {
			return dispatch(actionGeneralError(`No set found for setKey ${setKey}.`));
		} else {
			return dispatch(actionSetSetSync(setKey, sync));
		}
	}
};

const addMap = (map) => {
	return (dispatch, getState) => {
		if(map && !map.key) {
			return dispatch(actionGeneralError(`Undefined mapKey for map ${map}`));
		} else {
			const state = getState();
			const mapByKey = Select.maps.getMapByKey(state, map.key);
			
			if (mapByKey) {
				return dispatch(actionGeneralError(`Map with given mapKey (${map.key}) already exists ${mapByKey}`));
			} else {
				return dispatch(actionAddMap(map));
			}
		}
	};
};

const addMapForPeriod = (periodKey, setKey) => {
	return (dispatch, getState) => {
		const state = getState();
		let map = Select.maps.getMapByMetadata(state, {period: periodKey});

		if (!map) {
			let mapKey = utils.uuid();
			map = {
				key: mapKey,
				data: {
					metadataModifiers: {
						period: periodKey
					}
				}
			};
			dispatch(addMap(map));
		}

		dispatch(addMapToSet(setKey, map.key));
	};
};

const removeMap = (mapKey) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			return dispatch(actionRemoveMap(mapKey));
		}
	};
};

const removeMapForPeriod = (periodKey, setKey) => {
	return (dispatch, getState) => {
		const state = getState();
		const map = Select.maps.getMapByMetadata(state, {period: periodKey});
		if(!map) {
			dispatch(actionGeneralError(`No map found for period ${periodKey}.`));
		} else {
			dispatch(removeMapKeyFromSet(setKey, map.key));
		}
	};
};

const setMapName = (mapKey, name) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			return dispatch(actionSetMapName(mapKey, name));
		}
	};
};

const setMapData = (mapKey, data) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			return dispatch(actionSetMapData(mapKey, data));
		}
	};
};

const setMapWorldWindNavigator = (mapKey, worldWindNavigator) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			return dispatch(actionSetMapWorldWindNavigator(mapKey, worldWindNavigator));
		}
	};
};

const addLayerToEachMapInSet = (layer, zIndex) => {
	return (dispatch, getState) => {
		const state = getState();
		const activeSetKey = Select.maps.getActiveSetKey(state);
		const activeMapKeys = Select.maps.getMapSetMapKeys(state, activeSetKey);
		if(activeMapKeys) {
			activeMapKeys.forEach((mapKey) => {
				dispatch(Action.maps.addLayer(mapKey, layer, zIndex));
			})
		}
	}
}

const addLayer = (mapKey, layer, index) => {
	return (dispatch, getState) => {
		const state = getState();
		if (!layer.key){
			layer.key = utils.uuid();
		}
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			dispatch(actionAddLayer(mapKey, layer, index));
			dispatch(Action.maps.use(mapKey));
		}
	};
};

const addLayers = (mapKey, layers) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			return layers.map(layer => dispatch(addLayer(mapKey, layer)))
		}
	}
};

const removeLayer = (mapKey, layerKey) => {
	return (dispatch, getState) => {
		if(!layerKey) {
			return dispatch(actionGeneralError(`Undefined layer key.`));
		} else {
			const state = getState();
			const mapByKey = Select.maps.getMapByKey(state, mapKey);
			if(!mapByKey) {
				return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
			} else {
				//check if layer exist
				const layer = Select.maps.getMapLayerByMapKeyAndLayerKey(state, mapKey, layerKey);
				if(layer) {
					return dispatch(actionRemoveLayer(mapKey, layerKey));
				} else {
					return dispatch(actionGeneralError(`No layer (${layerKey}) found in mapKey ${mapKey}.`));
				}
			}
		}
	};
};

const removeLayers = (mapKey, layersKeys) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			return layersKeys.map(layerKey => dispatch(removeLayer(mapKey, layerKey)))
		}
	}
};

const setLayerIndex = (mapKey, layerKey, index) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			dispatch(actionSetLayerIndex(mapKey, layerKey, index));
		}
	}
};

/**
 * 
 * Similar like add layer.
 * It enables to set any layer property except layerKey. 
 * Layer object is merged with default layer option.
 */
const setMapLayer = (mapKey, layerKey, layer) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			//check if layer exist
			const layerExists = Select.maps.getMapLayerByMapKeyAndLayerKey(state, mapKey, layerKey);
			if(layerExists) {
				dispatch(actionSetMapLayer(mapKey, layerKey, layer));
			} else {
				return dispatch(actionGeneralError(`No layer (${layerKey}) found in mapKey ${mapKey}.`));
			}
		}
	}
};


/**
 * 
 * It enables to update any layer property except layerKey. 
 * Layer object is merged with actual layer option.
 */
const updateMapLayer = (mapKey, layerKey, layer) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			//check if layer exist
			const layerExists = Select.maps.getMapLayerByMapKeyAndLayerKey(state, mapKey, layerKey);
			if(layerExists) {
				dispatch(actionUpdateMapLayer(mapKey, layerKey, layer));
			} else {
				return dispatch(actionGeneralError(`No layer (${layerKey}) found in mapKey ${mapKey}.`));
			}
		}
	}
};

const updateWorldWindNavigator = (mapKey, updates) => {
	return (dispatch, getState) => {
		let set = Select.maps.getMapSetByMapKey(getState(), mapKey);
		let forSet = {};
		let forMap = {};

		if (set && set.sync) {
			forSet = _.pickBy(updates, (updateVal, updateKey) => {
				if (updateKey === 'lookAtLocation') {
					return set.sync['location'];
				} else {
					return set.sync[updateKey];
				}
			});

			forMap = _.omitBy(updates, (updateVal, updateKey) => {
				if (updateKey === 'lookAtLocation') {
					return set.sync['location'];
				} else {
					return set.sync[updateKey];
				}
			});
		} else {
			forMap = updates;
		}

		if (forSet && !_.isEmpty(forSet)) {
			//check data integrity
			forSet = checkWorldWindNavigatorIntegrity(forSet); //TODO test
			dispatch(actionUpdateSetWorldWindNavigator(set.key, forSet));
		}

		if (forMap && !_.isEmpty(forMap)) {
			//check data integrity
			forMap = checkWorldWindNavigatorIntegrity(forMap); //TODO test
			dispatch(actionUpdateMapWorldWindNavigator(mapKey, forMap));
		}
	}
};

const checkWorldWindNavigatorIntegrity = (WorldWindNavigator) => {
	if (WorldWindNavigator.heading && WorldWindNavigator.heading > 360) {
		WorldWindNavigator.heading = WorldWindNavigator.heading - 360;
	}

	if (WorldWindNavigator.heading && WorldWindNavigator.heading < -360) {
		WorldWindNavigator.heading = WorldWindNavigator.heading + 360;
	}

	if (WorldWindNavigator.tilt && WorldWindNavigator.tilt < 0) {
		WorldWindNavigator.tilt = 0;
	}

	if (WorldWindNavigator.tilt && WorldWindNavigator.tilt > 90) {
		WorldWindNavigator.tilt = 90;
	}
	return WorldWindNavigator;
};

const resetWorldWindNavigatorHeading = (mapKey, defaultIncrement) => {
	return (dispatch, getState) => {
		const mapNavigator = Select.maps.getNavigator(getState(), mapKey);

		let headingIncrement = 1.0;
		if (Math.abs(mapNavigator.heading) > 60) {
			headingIncrement = 2.0;
		} else if (Math.abs(mapNavigator.heading) > 120) {
			headingIncrement = 3.0;
		}
		//set shortest direction based on angle
		if (mapNavigator.heading > 0 && mapNavigator.heading < 180 || mapNavigator.heading < 0 && mapNavigator.heading < -180) {
			headingIncrement = -headingIncrement;
		}
		headingIncrement = defaultIncrement || headingIncrement;

		setTimeout(() => {
			let finalHeading;
			if (Math.abs(mapNavigator.heading) > Math.abs(headingIncrement)) {
				finalHeading = mapNavigator.heading + headingIncrement;
				dispatch(updateWorldWindNavigator(mapKey, {heading: finalHeading}))
				dispatch(resetWorldWindNavigatorHeading(mapKey, headingIncrement));
			} else {
				finalHeading = 0;
				dispatch(updateWorldWindNavigator(mapKey, {heading: finalHeading}))
			}
		}, 20)

	}
}

const setMapScope = (mapKey, scope) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			dispatch(actionSetMapScope(mapKey, scope));
		}
	};
};

const setMapScenario = (mapKey, scenario) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			dispatch(actionSetMapScenario(mapKey, scenario));
		}
	};
};

const setMapPeriod = (mapKey, period) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			dispatch(actionSetMapPeriod(mapKey, period));
		}
	};
};

const setMapPlace = (mapKey, place) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			dispatch(actionSetMapPlace(mapKey, place));
		}
	};
};

const setMapCase = (mapKey, caseKey) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			dispatch(actionSetMapCase(mapKey, caseKey));
		}
	};
};

const setMapBackgroundLayer = (mapKey, backgroundLayer) => {
	return (dispatch, getState) => {
		const state = getState();
		if (backgroundLayer && !backgroundLayer.key){
			backgroundLayer.key = utils.uuid();
		}
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			dispatch(actionSetMapBackgroundLayer(mapKey, backgroundLayer));
			dispatch(Action.maps.use(mapKey));
		}
	};
};

const setSetBackgroundLayer = (setKey, backgroundLayer) => {
	return (dispatch, getState) => {
		const state = getState();
		const setByKey = Select.maps.getMapSetByKey(state, setKey);
		if(!setByKey) {
			return dispatch(actionGeneralError(`No map set found for setKey ${setKey}.`));
		} else {
			dispatch(actionSetSetBackgroundLayer(setKey, backgroundLayer));
		}
	};
};

const use = (mapKey) => {
	return (dispatch, getState) => {
		let state = getState();
		let layers = Select.maps.getLayersStateByMapKey(state, mapKey);
		let backgroundLayer = Select.maps.getBackgroundLayerStateByMapKey(state, mapKey);
		let finalLayers = [];

		if (backgroundLayer) {
			finalLayers.push(backgroundLayer);
		}

		if (layers) {
			finalLayers = finalLayers.concat(layers);
		}

		if (finalLayers.length) {
			const componentId = `map_${mapKey}`;

			finalLayers.forEach(filters => {

				//assume, that spatial data dont need period
				const spatialRelationsFilter = _.cloneDeep(filters.mergedFilter);
				if(spatialRelationsFilter.periodKey) {
					delete spatialRelationsFilter.periodKey;
				}
				if(spatialRelationsFilter.attributeKey) {
					delete spatialRelationsFilter.attributeKey;
				}

				dispatch(Action.spatialRelations.useIndexedRegister( componentId, filters.filterByActive, spatialRelationsFilter, null, 1, 100));
				dispatch(Action.spatialRelations.ensureIndexed(spatialRelationsFilter, null, 1, 100,))
					.then(() => {
						let spatialDataSourcesKeys = Select.spatialRelations.getDataSourceKeysFiltered(getState(), spatialRelationsFilter);
						if (spatialDataSourcesKeys && spatialDataSourcesKeys.length) {

							dispatch(Action.spatialDataSources.useKeys([spatialDataSourcesKeys[0]], componentId)).then(() => {
								let dataSource = Select.spatialDataSources.getByKeys(getState(), spatialDataSourcesKeys);
								//datasource is only one
								//if vector dataSource, then load attribute data
								if(dataSource && dataSource[0] && dataSource[0].data.type === 'vector') {
									let spatialDataSources = Select.spatialRelations.getFilteredData(getState(), spatialRelationsFilter);

									const spatialFilter = {
										spatialDataSourceKey: dataSource[0].key,
										fidColumnName: spatialDataSources[0].fidColumnName
									};

									const spatialData = Select.spatialDataSources.vector.getBatchByFilterOrder(getState(), spatialFilter, null);
									//if data already loaded, skip loading
									if(!spatialData) {
										dispatch(Action.spatialDataSources.vector.loadLayerData(spatialFilter, componentId));
									}
									const attributeFilter = _.cloneDeep(filters.mergedFilter);
									dispatch(Action.attributeRelations.useIndexedRegister( componentId, filters.filterByActive, attributeFilter, null, 1, 100));

									dispatch(Action.attributeRelations.ensureIndexed(attributeFilter, null, 1, 100,)).then(() => {
										let attributeData = Select.attributeRelations.getFiltered(getState(), attributeFilter);
										
										const attributeDataSourcesKey = attributeData[0].attributeDataSourceKey;
										const attributeKey = attributeData[0].attributeKey;
										dispatch(Action.attributeDataSources.useKeys([attributeDataSourcesKey], componentId));
										dispatch(Action.attributes.useKeys([attributeKey], componentId));

										//get data
										const attributeDataFilter = {
											attributeDataSourceKey: attributeDataSourcesKey,
											fidColumnName: attributeData[0].fidColumnName
											//add active attribute
										}
										dispatch(Action.attributeData.loadFilteredData(attributeDataFilter, componentId));

										//get statistics
										const attributeStatisticsDataFilter = {
											attributeDataSourceKey: attributeData[0].attributeDataSourceKey
										}
										dispatch(Action.attributeStatistics.loadFilteredData(attributeStatisticsDataFilter, componentId));
									})
								}
								
							});
						}
					})
					.catch((err) => {
						dispatch(commonActions.actionGeneralError(err));
					});

				// TODO register and ensure layer templates
			});
		}
	};
};

function updateStateFromView(data) {
	return dispatch => {
		if (data) {
			dispatch(actionUpdate(data));
		}
	};
}

// ============ actions ===========

const actionSetActiveMapKey = (mapKey) => {
	return {
		type: ActionTypes.MAPS.SET_ACTIVE_MAP_KEY,
		mapKey
	}
};

const actionSetActiveSetKey = (setKey) => {
	return {
		type: ActionTypes.MAPS.SET_ACTIVE_SET_KEY,
		setKey
	}
};

const actionAddSet = (set) => {
	return {
		type: ActionTypes.MAPS.SET.ADD,
		set
	}
};

const actionRemoveSet = (setKey) => {
	return {
		type: ActionTypes.MAPS.SET.REMOVE,
		setKey
	}
};

const actionAddMapToSet = (setKey, mapKey) => {
	return {
		type: ActionTypes.MAPS.SET.ADD_MAP,
		setKey,
		mapKey,
	}
};

const actionRemoveMapKeyFromSet = (setKey, mapKey) => {
	return {
		type: ActionTypes.MAPS.SET.REMOVE_MAP,
		setKey,
		mapKey,
	}
};

const actionSetSetWorldWindNavigator = (setKey, worldWindNavigator) => {
	return {
		type: ActionTypes.MAPS.SET.WORLD_WIND_NAVIGATOR.SET,
		setKey,
		worldWindNavigator,
	}
};

const actionUpdateSetWorldWindNavigator = (setKey, worldWindNavigator) => {
	return {
		type: ActionTypes.MAPS.SET.WORLD_WIND_NAVIGATOR.UPDATE,
		setKey,
		worldWindNavigator,
	}
};

const actionSetSetSync = (setKey, sync) => {
	return {
		type: ActionTypes.MAPS.SET.SET_SYNC,
		setKey,
		sync,
	}
};

const actionAddMap = (map) => {
	return {
		type: ActionTypes.MAPS.MAP.ADD,
		map,
	}
};

const actionRemoveMap = (mapKey) => {
	return {
		type: ActionTypes.MAPS.MAP.REMOVE,
		mapKey,
	}
};

const actionSetMapName = (mapKey, name) => {
	return {
		type: ActionTypes.MAPS.MAP.SET_NAME,
		mapKey,
		name,
	}
};

const actionSetMapData = (mapKey, data) => {
	return {
		type: ActionTypes.MAPS.MAP.SET_DATA,
		mapKey,
		data,
	}
};

const actionSetMapWorldWindNavigator = (mapKey, worldWindNavigator) => {
	return {
		type: ActionTypes.MAPS.MAP.WORLD_WIND_NAVIGATOR.SET,
		mapKey,
		worldWindNavigator,
	}
};
const actionUpdateMapWorldWindNavigator = (mapKey, worldWindNavigator) => {
	return {
		type: ActionTypes.MAPS.MAP.WORLD_WIND_NAVIGATOR.UPDATE,
		mapKey,
		worldWindNavigator,
	}
};


const actionAddLayer = (mapKey, layer, index) => {
	return {
		type: ActionTypes.MAPS.LAYERS.LAYER.ADD,
		mapKey,
		layer,
		index,
	}
};

const actionRemoveLayer = (mapKey, layerKey) => {
	return {
		type: ActionTypes.MAPS.LAYERS.LAYER.REMOVE,
		mapKey,
		layerKey,
	}
};

const actionSetLayerIndex = (mapKey, layerKey, index) => {
	return {
		type: ActionTypes.MAPS.LAYERS.LAYER.SET_INDEX,
		mapKey,
		layerKey,
		index,
	}
};

const actionUpdateMapLayer = (mapKey, layerKey, layer) => {
	return {
		type: ActionTypes.MAPS.LAYERS.LAYER.UPDATE,
		mapKey,
		layerKey,
		layer,
	}
};

const actionSetMapLayer = (mapKey, layerKey, layer) => {
	return {
		type: ActionTypes.MAPS.LAYERS.LAYER.SET,
		mapKey,
		layerKey,
		layer,
	}
};

const actionSetMapBackgroundLayer = (mapKey, backgroundLayer) => {
	return {
		type: ActionTypes.MAPS.SET_BACKGROUND_LAYER,
		mapKey,
		backgroundLayer,
	}
};

const actionSetSetBackgroundLayer = (setKey, backgroundLayer) => {
	return {
		type: ActionTypes.MAPS.SET.SET_BACKGROUND_LAYER,
		setKey,
		backgroundLayer,
	}
};

const actionSetMapCase = (mapKey, caseKey) => {
	return {
		type: ActionTypes.MAPS.SET_CASE,
		mapKey,
		case: caseKey,
	}
};

const actionSetMapScope = (mapKey, scope) => {
	return {
		type: ActionTypes.MAPS.SET_SCOPE,
		mapKey,
		scope,
	}
};

const actionSetMapScenario = (mapKey, scenario) => {
	return {
		type: ActionTypes.MAPS.SET_SCENARIO,
		mapKey,
		scenario,
	}
};

const actionSetMapPlace = (mapKey, place) => {
	return {
		type: ActionTypes.MAPS.SET_PLACE,
		mapKey,
		place,
	}
};

const actionSetMapPeriod = (mapKey, period) => {
	return {
		type: ActionTypes.MAPS.SET_PERIOD,
		mapKey,
		period,
	}
};

const actionUpdate = (data) => {
	return {
		type: ActionTypes.MAPS.UPDATE,
		data
	}
};

// ============ export ===========

export default {
	addLayer,
	addLayers,
	addLayerToEachMapInSet,
	addMap,
	addMapForPeriod,
	addMapToSet,
	addSet,

	loadLayerTreesData,

	removeLayer,
	removeLayers,
	removeMap,
	removeMapForPeriod,
	removeMapKeyFromSet,
	removeSet,

	resetWorldWindNavigatorHeading,

	setActiveMapKey,
	setActiveSetKey, //test
	setLayerIndex,

	setMapBackgroundLayer,
	setMapCase,
	setMapData,
	setMapLayer,
	setMapName,
	setMapPeriod,
	setMapPlace,
	setMapScenario,
	setMapScope,
	setMapWorldWindNavigator,

	setSetBackgroundLayer,
	setSetSync,
	setSetWorldWindNavigator,

	updateMapLayer,
	updateStateFromView,
	updateWorldWindNavigator,
	use,
	useClear
}
