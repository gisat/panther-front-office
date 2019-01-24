import ActionTypes from '../../constants/ActionTypes';
import Select from '../../state/Select';

// ============ creators ===========
const setActiveMapKey = (mapKey) => {
	return dispatch => {
		dispatch(actionSetActiveMapKey(mapKey));
	};
};

const addSet = (set) => {
	return dispatch => {
		dispatch(actionAddSet(set));
	};
};

const removeSet = (setKey) => {
	return dispatch => {
		dispatch(actionRemoveSet(setKey));
	};
};

const addMapToSet = (setKey, mapKey) => {
	return dispatch => {
		dispatch(actionAddMapToSet(setKey, mapKey));
	};
};

const removeMapKeyFromSet = (setKey, mapKey) => {
	return dispatch => {
		dispatch(actionRemoveMapKeyFromSet(setKey, mapKey));
	};
};

const setSetWorldWindNavigatorSync = (setKey, worldWindNavigator) => {
	return dispatch => {
		dispatch(actionSetSetWorldWindNavigatorSync(setKey, worldWindNavigator));
	};
};

const addMap = (map) => {
	return dispatch => {
		dispatch(actionAddMap(map));
	};
};

const removeMap = (mapKey) => {
	return dispatch => {
		dispatch(actionRemoveMap(mapKey));
	};
};

const setMapName = (mapKey,name) => {
	return dispatch => {
		dispatch(actionSetMapName(mapKey, name));
	};
};

const setMapData = (map) => {
	return dispatch => {
		dispatch(actionSetMapData(map));
	};
};

const setMapWorldWindNavigator = (mapKey, worldWindNavigator) => {
	return dispatch => {
		dispatch(actionSetMapWorldWindNavigator(mapKey, worldWindNavigator));
	};
};

const addLayer = (mapKey, layer) => {
	return dispatch => {
		dispatch(actionAddLayer(mapKey, layer));
	};
};

const addLayers = (mapKey, layers) => {
	return dispatch => {
		dispatch(actionAddLayers(mapKey, layers));
	};
};

const removeLayer = (mapKey, layerKey) => {
	return dispatch => {
		dispatch(actionRemoveLayer(mapKey, layerKey));
	};
};

const removeLayers = (mapKey, layersKeys) => {
	return dispatch => {
		dispatch(actionRemoveLayers(mapKey, layersKeys));
	};
};

const setLayerIndex = (mapKey, layerKey, index) => {
	return dispatch => {
		dispatch(actionSetLayerIndex(mapKey, layerKey, index));
	};
};

const updateMapLayer = (mapKey, layerKey, layer) => {
	return dispatch => {
		dispatch(actionUpdateMapLayer(mapKey, layerKey, layer));
	};
};

const updateWorldWindNavigator = (mapKey, mapSetKey, updates) => {
	return (dispatch, getState) => {
		let sync = Select.maps.getMapSync(getState(), mapKey, mapSetKey);


		// rozhodnout, zda updatovat set nebo mapu
		// selelect, který koukne jestli, je mapa v daném setu a pokud ano, vrátí sync

		// podle sync se rozhodne, co updatovat kde (jestli v setu, nebo v mapě)
	}
};

const setMapScope = (mapKey, scope) => {
	return dispatch => {
		dispatch(actionSetMapScope(mapKey, scope));
	};
};

const setMapScenario = (mapKey, scenario) => {
	return dispatch => {
		dispatch(actionSetMapScenario(mapKey, scenario));
	};
};

const setMapPeriod = (mapKey, period) => {
	return dispatch => {
		dispatch(actionSetMapPeriod(mapKey, period));
	};
};

const setMapPlace = (mapKey, place) => {
	return dispatch => {
		dispatch(actionSetMapPlace(mapKey, place));
	};
};

const setMapCase = (mapKey, caseKey) => {
	return dispatch => {
		dispatch(actionSetMapCase(mapKey, caseKey));
	};
};

const setMapBackgroundLayer = (mapKey, backgroundLayer) => {
	return dispatch => {
		dispatch(actionSetMapBackgroundLayer(mapKey, backgroundLayer));
	};
};




// specialized


// ============ actions ===========

const actionSetActiveMapKey = (mapKey) => {
	return {
		type: ActionTypes.MAPS.SET_ACTIVE_MAP_KEY,
		mapKey
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

const actionSetSetWorldWindNavigatorSync = (setKey, worldWindNavigator) => {
	return {
		type: ActionTypes.MAPS.SET.SET_WORLD_WIND_NAVIGATOR_SYNC,
		setKey,
		worldWindNavigator,
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

const actionSetMapData = (map) => {
	return {
		type: ActionTypes.MAPS.MAP.SET_DATA,
		map,
	}
};

const actionSetMapWorldWindNavigator = (mapKey, worldWindNavigator) => {
	return {
		type: ActionTypes.MAPS.MAP.SET_WORLD_WIND_NAVIGATOR,
		mapKey,
		worldWindNavigator,
	}
};

const actionAddLayer = (mapKey, layer) => {
	return {
		type: ActionTypes.MAPS.LAYERS.ADD_LAYER,
		mapKey,
		layer,
	}
};

const actionAddLayers = (mapKey, layers) => {
	return {
		type: ActionTypes.MAPS.LAYERS.ADD_LAYERS,
		mapKey,
		layers,
	}
};

const actionRemoveLayer = (mapKey, layerKey) => {
	return {
		type: ActionTypes.MAPS.LAYERS.REMOVE_LAYER,
		mapKey,
		layerKey,
	}
};

const actionRemoveLayers = (mapKey, layersKeys) => {
	return {
		type: ActionTypes.MAPS.LAYERS.REMOVE_LAYERS,
		mapKey,
		layersKeys,
	}
};

const actionSetLayerIndex = (mapKey, layerKey, index) => {
	return {
		type: ActionTypes.MAPS.LAYERS.SET_LAYER_INDEX,
		mapKey,
		layerKey,
		index,
	}
};

const actionUpdateMapLayer = (mapKey, layerKey, layer) => {
	return {
		type: ActionTypes.MAPS.LAYERS.UPDATE_MAP_LAYER,
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
	setActiveMapKey,
	addSet,
	removeSet,
	addMapToSet,
	removeMapKeyFromSet,
	setSetWorldWindNavigatorSync,
	addMap,
	removeMap,
	setMapName,
	setMapData,
	setMapWorldWindNavigator,
	addLayer,
	addLayers,
	removeLayer,
	removeLayers,
	setLayerIndex,
	updateMapLayer,
	updateWorldWindNavigator,
	setMapBackgroundLayer,
	setMapCase,
	setMapPeriod,
	setMapPlace,
	setMapScenario,
	setMapScope


}
