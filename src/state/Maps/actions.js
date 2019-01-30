import _ from 'lodash';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../../state/Select';
import commonActions from '../_common/actions';
import commonSelectors from '../_common/selectors';
import utils from '../../utils/utils';

const {actionGeneralError} = commonActions;

// ============ creators ===========
const useClear = (mapKey) => {
	return (dispatch) => {
		dispatch(commonActions.useIndexedClear(ActionTypes.SPATIAL_RELATIONS, `map_${mapKey}`));
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

const addLayer = (mapKey, layer) => {
	return (dispatch, getState) => {
		const state = getState();
		const layerKey = layer.key || utils.uuid();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			return dispatch(actionAddLayer(mapKey, layer));
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
			dispatch(actionUpdateSetWorldWindNavigator(set.key, forSet));
		}

		if (forMap && !_.isEmpty(forMap)) {
			dispatch(actionUpdateMapWorldWindNavigator(mapKey, forMap));
		}
	}
};

const resetWorldWindNavigatorHeading = (mapKey, defaultIncrement) => {
	return (dispatch, getState) => {
		const mapNavigator = Select.maps.getMapNavigator(getState(), mapKey);

		let headingIncrement = 1.0;
		if (Math.abs(mapNavigator.heading) > 60) {
			headingIncrement = 2.0;
		} else if (Math.abs(mapNavigator.heading) > 120) {
			headingIncrement = 3.0;
		}
		if (mapNavigator.heading > 0) {
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
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			dispatch(actionSetMapBackgroundLayer(mapKey, backgroundLayer));
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
		let activeKeys = commonSelectors.getAllActiveKeys(state);

		if (layers) {
			layers.forEach(layer => {
				let filters = getFiltersForUse(layer, activeKeys);

				dispatch(commonActions.useIndexedRegister(ActionTypes.SPATIAL_RELATIONS, `map_${mapKey}`, filters.filterByActive, filters.filter, null, 1, 100));
				dispatch(commonActions.ensureIndexed(Select.spatialRelations.getSubstate, 'spatial', filters.mergedFilter, null, 1, 100, ActionTypes.SPATIAL_RELATIONS, 'relations'));
			});
		}
	};
};


// ============ helpers ===========

/**
 * Prepare filters for use from layers state
 * @param layer {Array} Collection of layers state
 * @param activeKeys {Object} Metadata active keys
 * @return {{filter, filterByActive, mergedFilter}}
 */
function getFiltersForUse(layer, activeKeys) {
	let filter = {};
	let filterByActive = {};
	let mergedFilter = {};

	if (layer.hasOwnProperty('scope')){
		filter.scopeKey = layer.scope;
	} else {
		filterByActive.scope = true;
		if (activeKeys.activeScopeKey) {
			mergedFilter.scopeKey = activeKeys.activeScopeKey;
		}
	}
	if (layer.hasOwnProperty('place')){
		filter.placeKey = layer.place;
	} else {
		filterByActive.place = true;
		if (activeKeys.activePlaceKey) {
			mergedFilter.placeKey = activeKeys.activePlaceKey;
		}
	}
	if (layer.hasOwnProperty('period')){
		filter.periodKey = layer.period;
	} else {
		filterByActive.period = true;
		if (activeKeys.activePeriodKey) {
			mergedFilter.periodKey = activeKeys.activePeriodKey;
		}
	}
	if (layer.hasOwnProperty('case')){
		filter.caseKey = layer.case;
	} else {
		filterByActive.case = true;
		if (activeKeys.activeCaseKey) {
			mergedFilter.caseKey = activeKeys.activeCaseKey;
		}
	}
	if (layer.hasOwnProperty('scenario')){
		filter.scenarioKey = layer.scenario;
	} else {
		filterByActive.scenario = true;
		if (activeKeys.activeScenarioKey) {
			mergedFilter.scenarioKey = activeKeys.activeScenarioKey;
		}
	}
	if (layer.hasOwnProperty('layerTemplate')){
		filter.layerTemplateKey = layer.layerTemplate;
	}

	mergedFilter = {...filter, ...mergedFilter};

	return {
		filter,
		filterByActive,
		mergedFilter
	}
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


const actionAddLayer = (mapKey, layer) => {
	return {
		type: ActionTypes.MAPS.LAYERS.LAYER.ADD,
		mapKey,
		layer,
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

// ============ export ===========

export default {
	addLayer,
	addLayers,
	addMap,
	addMapToSet,
	addSet,

	removeLayer,
	removeLayers,
	removeMap,
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
	updateWorldWindNavigator,
	use,
	useClear
}
