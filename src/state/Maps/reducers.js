import ActionTypes from '../../constants/ActionTypes';
import Action from '../Action';
import _ from 'lodash';
import { removeListener } from 'cluster';

const INITIAL_WORLDWINDNAVIGATOR = {
	lookAtLocation: {
		latitude: 50,
		longitude: 14
	},
	range: 11000,
	tilt: 0,
	heading: 0,
	elevation: 0
}

const INITIAL_LAYER_STATE = {
	key: null, //FIXME - add?
	layerTemplate: null,
	style: null,
	period: null,
	opacity: 100
}

const INITIAL_MAP_STATE = {
	key: null,
	name: null,
	data: {
		scope: null,
		place: null,
		scenario: null,
		case: null,
		period: null,
		backgroundLayer: null,
		layers: [],
		worldWindNavigator: null,
	}
}

const INITIAL_SET_STATE = {
	key: null,
	maps: [],
	sync: {
		location: null,
		range: null,
		tilt: null,
		heading: null
	},
	data: {}
}

const INITIAL_STATE = {
	activeKey: null,
	activeMapKey: null,
	maps: {},
	sets: {}
};

const setActiveMapKey = (state, mapKey) => {
	return {...state, activeMapKey: mapKey}
};

const addSet = (state, setState) => {
	const mergedSetState = _.merge(_.cloneDeep(INITIAL_SET_STATE), setState); //FIXME - může být?
	
	const newSets = {...state.sets};
	newSets[mergedSetState.key] = mergedSetState;
	return {...state, sets: {...newSets}};
};

const removeSet = (state, setKey) => {
	const withoutSetKey = removeItemByKey(state.sets, setKey);
	
	return {...state, sets: withoutSetKey};
}

//helpers
const getSetByKey = (state, setKey) => state.sets[setKey];
const removeItemByIndex = (array, index) => [...array.slice(0, index), ...array.slice(index + 1)];
const addItemToIndex = (array, index, item) => [...array.slice(0, index), item, ...array.slice(index)];
const replaceItemOnIndex = (array, index, item) => [...array.slice(0, index), item, ...array.slice(index + 1)];
const removeItemByKey = (object, key) => {
	const {[key]: value, ...withoutKey} = object;
	return withoutKey;
}
const getMapByKey = (state, mapKey) => state.maps[mapKey];


const addMapKeyToSet = (state, setKey, mapKey) => {
	const setToUpdate = getSetByKey(state, setKey);
	return {...state, sets: {...state.sets, [setKey]: {...setToUpdate, maps: [...setToUpdate.maps, mapKey]}}};
}

const removeMapKeyFromSet = (state, setKey, mapKey) => {
	
	const setToUpdate = getSetByKey(state, setKey);
	const mapIndex = setToUpdate.maps.indexOf(mapKey);
	return {...state, sets: {...state.sets, [setKey]: {...setToUpdate,maps: removeItemByIndex(setToUpdate.maps, mapIndex)}}};
}

const setSetWorldWindNavigatorSync = (state, setKey, worldWindNavigator = INITIAL_WORLDWINDNAVIGATOR) => {
	const mergedWorldWindNavigator = _.merge(_.cloneDeep(INITIAL_WORLDWINDNAVIGATOR), worldWindNavigator); //FIXME - může být?
	const setToUpdate = getSetByKey(state, setKey);
	return {...state, sets: {...state.sets, [setKey]: {...setToUpdate, sync: mergedWorldWindNavigator}}};
};

/**
 * Add new map state. Rewrite map state if exist.
 * FIXME - should merge with existing?
 * */
const addMap = (state, mapState = INITIAL_MAP_STATE) => {
	const mergedMapState = _.merge(_.cloneDeep(INITIAL_MAP_STATE), mapState); //FIXME - může být?
	return {...state, maps: {...state.maps, [mergedMapState.key]: mergedMapState}};
}

const removeMap = (state, mapKey) => {
	const newMaps = removeItemByKey(state.maps, mapKey);
	let newMapsState = {...state, maps: newMaps};
	//If mapKey is in sets, then remove it from each
	for (const [key, value] of Object.entries(state.sets)) {
		if(value.maps.includes(mapKey)) {
			newMapsState = {...removeMapKeyFromSet(newMapsState, value.key, mapKey)}
		}
	}
	return newMapsState;
}

const setMapName = (state, mapKey, name) => {
	const mapState = getMapByKey(state, mapKey);
	return {...state, maps: {[mapKey]: {...mapState, name: name}}}
}

const setMapData = (state, mapState = INITIAL_MAP_STATE) => {
	const mergedMapState = _.merge(_.cloneDeep(INITIAL_MAP_STATE), mapState); //FIXME - může být?
	return {...state, maps: {...state.maps, [mergedMapState.key]: {...mergedMapState}}};
}

const setMapWorldWindNavigator = (state, mapKey, worldWindNavigator = INITIAL_WORLDWINDNAVIGATOR) => {
	const mergedWorldWindNavigator = _.merge(_.cloneDeep(INITIAL_WORLDWINDNAVIGATOR), worldWindNavigator); //FIXME - může být?
	const mapState = getMapByKey(state, mapKey);
	return setMapData(state, {...mapState, worldWindNavigator: mergedWorldWindNavigator})
};


//FIXME - optional parametr index?
//FIXME - define layer state
//FIXME - unique layer by KEY check?
const addLayer = (state, mapKey, layerState) => {
	const mapState = getMapByKey(state, mapKey);
	return setMapData(state, {...mapState, data: {...mapState.data, layers: [...mapState.data.layers, layerState]}})
};

const addLayers = (state, mapKey, layersState = []) => {
	let newState = {...state};
	for (const layerState of layersState) {
		newState = {...newState, ...addLayer(newState, mapKey, layerState)};
	};
	return newState;
};

const removeLayer = (state, mapKey, layerKey) => {
	const mapState = getMapByKey(state, mapKey);
	const layerIndex = mapState.data.layers.findIndex(l => l.key ===layerKey);
	return setMapData(state, {...mapState, data: {layers: removeItemByIndex(mapState.data.layers, layerIndex)}});
};

const removeLayers = (state, mapKey, layersKeys = [])=> {
	let newState = {...state};
	for (const layerKey of layersKeys) {
		const withoutLayer = removeLayer(newState, mapKey, layerKey);
		newState = {...newState, maps: {...newState.maps, [mapKey]: {...newState.maps[mapKey], data: {...newState.maps[mapKey].data, layers: [...withoutLayer.maps[mapKey].data.layers]}}}}
	}
	return newState;
};

const setLayerIndex = (state, mapKey, layerKey, index) => {
	const mapState = getMapByKey(state, mapKey);
	const layerIndex = mapState.data.layers.findIndex(l => l.key ===layerKey);
	const layerState = {...mapState.data.layers[layerIndex]};
	const withoutLayer = removeItemByIndex(mapState.data.layers, layerIndex);
	const onPosition = addItemToIndex(withoutLayer, index, layerState);
	return setMapData(state, {...mapState, data: {...mapState.data, layers: onPosition}});
};

const updateMapLayer = (state, mapKey, layerState = INITIAL_LAYER_STATE) => {
	const mergedLayerState = _.merge(_.cloneDeep(INITIAL_LAYER_STATE), layerState); //FIXME - může být?
	const mapState = getMapByKey(state, mapKey);
	const layerIndex = mapState.data.layers.findIndex(l => l.key === mergedLayerState.key);
	if(layerIndex > -1) {
		const updatedLayers = replaceItemOnIndex(mapState.data.layers, layerIndex, mergedLayerState)
		return setMapData(state, {...mapState, data: {...mapState.data, layers: updatedLayers}});
	} else {
		//error - layer not found
		return state;
	}
}

const setMapScope = (state, mapKey, scope) => {
	const mapState = getMapByKey(state, mapKey);
	return setMapData(state, {...mapState, scope});
};

const setMapPlace = (state, mapKey, place) => {
	const mapState = getMapByKey(state, mapKey);
	return setMapData(state, {...mapState, place});
};

const setMapScenario = (state, mapKey, scenario) => {
	const mapState = getMapByKey(state, mapKey);
	return setMapData(state, {...mapState, scenario});
};

const setMapCase = (state, mapKey, caseKey) => {
	const mapState = getMapByKey(state, mapKey);
	return setMapData(state, {...mapState, case: caseKey});
};

const setMapPeriod = (state, mapKey, period) => {
	const mapState = getMapByKey(state, mapKey);
	return setMapData(state, {...mapState, period});
};

const setMapBackgroundLayer = (state, mapKey, backgroundLayer) => {
	const mapState = getMapByKey(state, mapKey);
	return setMapData(state, {...mapState, backgroundLayer});
};

export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.MAPS.SET_ACTIVE_MAP_KEY:
			return setActiveMapKey(state, action.mapKey);
		case ActionTypes.MAPS.ADD_SET:
			return addSet(state, action.set);
		case ActionTypes.MAPS.REMOVE_SET:
			return removeSet(state, action.setKey);
		case ActionTypes.MAPS.ADD_MAP_TO_SET:
			return addMapKeyToSet(state, action.setKey, action.mapKey);
		case ActionTypes.MAPS.REMOVE_MAP_KEY_FROM_SET:
			return removeMapKeyFromSet(state, action.setKey, action.mapKey);
		case ActionTypes.MAPS.SET_SET_WORLD_WIND_NAVIGATOR_SYNC:
			return setSetWorldWindNavigatorSync(state, action.setKey, action.worldWindNavigator);
		case ActionTypes.MAPS.ADD_MAP:
			return addMap(state, action.map);
		case ActionTypes.MAPS.REMOVE_MAP:
			return removeMap(state, action.mapKey);
		case ActionTypes.MAPS.SET_MAP_NAME:
			return setMapName(state, action.mapKey, action.name);
		case ActionTypes.MAPS.SET_MAP_DATA:
			return setMapData(state, action.map);
		case ActionTypes.MAPS.SET_MAP_WORLD_WIND_NAVIGATOR:
			return setMapWorldWindNavigator(state, action.mapKey, action.worldWindNavigator);
		case ActionTypes.MAPS.ADD_LAYER:
			return addLayer(state, action.mapKey, action.layer);
		case ActionTypes.MAPS.ADD_LAYERS:
			return addLayers(state, action.mapKey, action.layers);
		case ActionTypes.MAPS.REMOVE_LAYER:
			return removeLayer(state, action.mapKey, action.layerKey);
		case ActionTypes.MAPS.REMOVE_LAYERS:
			return removeLayers(state, action.mapKey, action.layersKeys);
		case ActionTypes.MAPS.SET_LAYER_INDEX:
			return setLayerIndex(state, action.mapKey, action.layerKey, action.index);
		case ActionTypes.MAPS.UPDATE_MAP_LAYER:
			return updateMapLayer(state, action.mapKey, action.layer);
		case ActionTypes.MAPS.SET_MAP_SCOPE:
			return setMapScope(state, action.mapKey, action.scope);
		case ActionTypes.MAPS.SET_MAP_SCENARIO:
			return setMapScenario(state, action.mapKey, action.scenario);
		case ActionTypes.MAPS.SET_MAP_PERIOD:
			return setMapPeriod(state, action.mapKey, action.period);
		case ActionTypes.MAPS.SET_MAP_PLACE:
			return setMapPlace(state, action.mapKey, action.place);
		case ActionTypes.MAPS.SET_MAP_CASE:
			return setMapCase(state, action.mapKey, action.case);
		case ActionTypes.MAPS.SET_MAP_BACKGROUND_LAYER:
			return setMapBackgroundLayer(state, action.mapKey, action.backgroundLayer);
		default:
			return state;
	}
}
