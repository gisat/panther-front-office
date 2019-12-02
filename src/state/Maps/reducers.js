import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import {removeItemByIndex, addItemToIndex, replaceItemOnIndex, removeItemByKey} from '../../utils/stateManagement';
import {isNumber} from 'lodash';

const INITIAL_VIEW = {
	center: {
		lat: 50.1,
		lon: 14.5
	},
	boxRange: 100000,
	roll: 0,
	tilt: 0,
	heading: 0,
	elevationExaggeration: 0
};

const INITIAL_LAYER_STATE = {
	key: null,
	layerTemplate: null,
	style: null,
	opacity: 100
};

const INITIAL_MAP_STATE = {
	key: null,
	name: null,
	data: {
		backgroundLayer: null,
		layers: null,
		metadataModifiers: null,
		worldWindNavigator: null, // TODO deprecated
		view: null,
		filterByActive: null
	}
};

const INITIAL_SET_STATE = {
	key: null,
	maps: [],
	sync: {
		location: false, // TODO deprecated
		center: false,
		roll: false,
		range: false,
		tilt: false,
		heading: false,
		elevation: false,

	},
	data: {
		backgroundLayer: null,
		layers: null,
		metadataModifiers: null,
		worldWindNavigator: null, // TODO deprecated
		view: null,
		filterByActive: null
	}
};

const INITIAL_STATE = {
	activeSetKey: null,
	activeMapKey: null,
	maps: {},
	sets: {}
};

// helpers
const getSetByKey = (state, setKey) => state.sets[setKey];
const getMapByKey = (state, mapKey) => state.maps[mapKey];

// reducers
const setInitial = () => {
	return {...INITIAL_STATE}
};

const setActiveMapKey = (state, mapKey) => {
	return {...state, activeMapKey: mapKey}
};

const setSetActiveMapKey = (state, setKey, mapKey) => {
	const setToUpdate = getSetByKey(state, setKey);
	return {...state, sets: {...state.sets, [setKey]: {...setToUpdate, activeMapKey: mapKey}}};
};

const setActiveSetKey = (state, setKey) => {
	return {...state, activeSetKey: setKey}
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
};

const setSetSync = (state, setKey, syncData) => {
	const setToUpdate = getSetByKey(state, setKey);
	return {...state, sets: {...state.sets, [setKey]: {...setToUpdate, sync: {...setToUpdate.sync, ...syncData}}}};
};

const setSetMaps = (state, setKey, maps) => {
	const setToUpdate = getSetByKey(state, setKey);
	return {...state, sets: {...state.sets, [setKey]: {...setToUpdate, maps}}};
};

const addMapKeyToSet = (state, setKey, mapKey) => {
	const setToUpdate = getSetByKey(state, setKey);
	return {...state, sets: {...state.sets, [setKey]: {...setToUpdate, maps: [...setToUpdate.maps, mapKey]}}};
};

const removeMapKeyFromSet = (state, setKey, mapKey) => {
	
	const setToUpdate = getSetByKey(state, setKey);
	const mapIndex = setToUpdate.maps.indexOf(mapKey);
	return {...state, sets: {...state.sets, [setKey]: {...setToUpdate,maps: removeItemByIndex(setToUpdate.maps, mapIndex)}}};
};

const setSetView = (state, setKey, view = INITIAL_VIEW) => {
	const mergedView = {...INITIAL_VIEW, ...view};
	const setToUpdate = getSetByKey(state, setKey);
	return {...state, sets: {...state.sets, [setKey]: {...setToUpdate, data: {...setToUpdate.data, view: mergedView}}}};
};

const updateSetView = (state, setKey, updates) => {
	if (updates && !_.isEmpty(updates)) {
		return {
			...state,
			sets: {
				...state.sets,
				[setKey]: {
					...state.sets[setKey],
					data: {
						...state.sets[setKey].data,
						view: state.sets[setKey].data.view ?
							{...state.sets[setKey].data.view, ...updates} : updates
					}
				}
			}
		};
	} else {
		return state;
	}
};

/**
 * Add new map state. Rewrite map state if exist.
 * */
const addMap = (state, mapState = INITIAL_MAP_STATE) => {
	const mergedMapState = _.merge(_.cloneDeep(INITIAL_MAP_STATE), mapState);
	return {...state, maps: {...state.maps, [mergedMapState.key]: mergedMapState}};
};

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
};

const setMapName = (state, mapKey, name) => {
	const mapState = getMapByKey(state, mapKey);
	return {...state, maps: {[mapKey]: {...mapState, name: name}}}
};

const setMapLayerHoveredFeatureKeys = (state, mapKey, layerKey, hoveredFeatureKeys) => {
	const mapState = getMapByKey(state, mapKey);
	return state;
	// todo

	// const layerIndex = mapState.data.layers.findIndex(l => l.key === layerKey);
	// if (layerIndex > -1) {
	// 	const mergedLayerState = _.merge(_.cloneDeep({...mapState.data.layers[layerIndex]}), layerState);
	// 	const updatedLayers = replaceItemOnIndex(mapState.data.layers, layerIndex, mergedLayerState);
	// 	return setMap(state, {...mapState, data: {...mapState.data, layers: updatedLayers}});
	// } else {
	// 	//error - layer not found
	// 	return state;
	// }
};

const setMap = (state, mapState = INITIAL_MAP_STATE) => {
	const mergedMapState = _.merge(_.cloneDeep(INITIAL_MAP_STATE), mapState); //todo where is this used & is the merge always ok?
	return {...state, maps: {...state.maps, [mergedMapState.key]: {...mergedMapState}}};
};

const setMapData = (state, mapKey, mapData = {}) => {
	return {...state, maps: {...state.maps, [mapKey]: {...state.maps[mapKey], data: mapData}}};
};

const setMapView = (state, mapKey, view = INITIAL_VIEW) => {
	const mergedView = {...INITIAL_VIEW, ...view};
	return {
		...state,
		maps: {...state.maps, [mapKey]: {...state.maps[mapKey], data: {...state.maps[mapKey].data, view: mergedView}}}
	};
};

const updateMapView = (state, mapKey, updates) => {
	const mergedView = {...state.maps[mapKey].data.view, ...updates};
	return {
		...state,
		maps: {...state.maps, [mapKey]: {...state.maps[mapKey], data: {...state.maps[mapKey].data, view: mergedView}}}
	};
};


//FIXME - define layer state
//FIXME - unique layer by KEY check?
/**
 * 
 * @param {Object} state 
 * @param {string} mapKey 
 * @param {Object} layerState 
 * @param {number} index - position in map
 */
const addLayer = (state, mapKey, layerState, index) => {
	let mapState = getMapByKey(state, mapKey);
	//ensure that data.layers exists
	if (!mapState.data.layers) {
		mapState = {...mapState, data: {...mapState.data, layers: []}}
	}
	const newState = setMap(state, {...mapState, data: {...mapState.data, layers: [...mapState.data.layers, layerState]}})
	if (isNumber(index)) {
		// setLayerIndex
		return setLayerIndex(newState, mapKey, layerState.key, index)
	} else {
		return newState
	}

};

const removeLayer = (state, mapKey, layerKey) => {
	const mapState = getMapByKey(state, mapKey);
	const layerIndex = mapState.data.layers.findIndex(l => l.key === layerKey);
	return setMap(state, {...mapState, data: {...mapState.data, layers: removeItemByIndex(mapState.data.layers, layerIndex)}});
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
	return setMap(state, {...mapState, data: {...mapState.data, layers: onPosition}});
};

const setMapLayer = (state, mapKey, layerState = INITIAL_LAYER_STATE, layerKey) => {
	const mergedLayerState = _.merge(_.cloneDeep(INITIAL_LAYER_STATE), layerState); //FIXME - musí se mergnout se stavem
	const mergedLayerStateWithoutKey = removeItemByKey(mergedLayerState, 'key');
	mergedLayerStateWithoutKey['key'] = layerKey;
	const mapState = getMapByKey(state, mapKey);
	const layerIndex = mapState.data.layers.findIndex(l => l.key === layerKey);
	if(layerIndex > -1) {
		const updatedLayers = replaceItemOnIndex(mapState.data.layers, layerIndex, mergedLayerStateWithoutKey);
		return setMap(state, {...mapState, data: {...mapState.data, layers: updatedLayers}});
	} else {
		//error - layer not found
		return state;
	}
};

const updateMapLayer = (state, mapKey, layerState = INITIAL_LAYER_STATE, layerKey) => {
	// const mergedLayerState = _.merge(_.cloneDeep(INITIAL_LAYER_STATE), layerState); //FIXME - musí se mergnout se stavem
	const mapState = getMapByKey(state, mapKey);
	const layerIndex = mapState.data.layers.findIndex(l => l.key === layerKey);
	if(layerIndex > -1) {
		layerState['key'] = layerKey;
		const mergedLayerState = _.merge(_.cloneDeep({...mapState.data.layers[layerIndex]}), layerState);
		const updatedLayers = replaceItemOnIndex(mapState.data.layers, layerIndex, mergedLayerState);
		return setMap(state, {...mapState, data: {...mapState.data, layers: updatedLayers}});
	} else {
		//error - layer not found
		return state;
	}
};

const setMapScope = (state, mapKey, scope) => {
	const mapState = getMapByKey(state, mapKey);
	return setMap(state, {...mapState, scope});
};

const setMapPlace = (state, mapKey, place) => {
	const mapState = getMapByKey(state, mapKey);
	return setMap(state, {...mapState, place});
};

const setMapScenario = (state, mapKey, scenario) => {
	const mapState = getMapByKey(state, mapKey);
	return setMap(state, {...mapState, scenario});
};

const setMapCase = (state, mapKey, caseKey) => {
	const mapState = getMapByKey(state, mapKey);
	return setMap(state, {...mapState, case: caseKey});
};

const setMapPeriod = (state, mapKey, period) => {
	const mapState = getMapByKey(state, mapKey);
	return setMap(state, {...mapState, period});
};

const setMapBackgroundLayer = (state, mapKey, backgroundLayer) => {
	const mapState = getMapByKey(state, mapKey);
	return setMap(state, {...mapState, data: {...mapState.data, backgroundLayer}});
};

const setMapLayers = (state, mapKey, layers) => {
	const mapState = getMapByKey(state, mapKey);
	return {...state, maps: {...state.maps, [mapKey]: {...mapState, data: {...mapState.data, layers}}}};
};

const setSetBackgroundLayer = (state, setKey, backgroundLayer) => {
	return {
		...state,
		sets: {
			...state.sets,
			[setKey]: {
				...state.sets[setKey],
				data: {
					...state.sets[setKey].data,
					backgroundLayer: backgroundLayer
				}
			}
		}
	};
};

const update = (state, data) => {
	return {...state, ...data};
};



/* =======================================================
   DEPRECATED
========================================================== */

const INITIAL_WORLDWINDNAVIGATOR = {
	lookAtLocation: {
		latitude: 50.1,
		longitude: 14.5
	},
	range: 100000,
	roll: 0,
	tilt: 0,
	heading: 0,
	elevation: 0
};

const deprecated_setSetWorldWindNavigator = (state, setKey, worldWindNavigator = INITIAL_WORLDWINDNAVIGATOR) => {
	const mergedWorldWindNavigator = _.merge(_.cloneDeep(INITIAL_WORLDWINDNAVIGATOR), worldWindNavigator);
	const setToUpdate = getSetByKey(state, setKey);
	return {...state, sets: {...state.sets, [setKey]: {...setToUpdate, data: {...setToUpdate.data, worldWindNavigator: mergedWorldWindNavigator}}}};
};

const deprecated_setMapWorldWindNavigator = (state, mapKey, worldWindNavigator = INITIAL_WORLDWINDNAVIGATOR) => {
	const mergedWorldWindNavigator = _.merge(_.cloneDeep(INITIAL_WORLDWINDNAVIGATOR), worldWindNavigator);
	const mapState = getMapByKey(state, mapKey);
	return setMap(state, {...mapState, data: {...mapState.data, worldWindNavigator: mergedWorldWindNavigator}})
};

const deprecated_updateMapWorldWindNavigator = (state, mapKey, updates) => {
	const mapState = getMapByKey(state, mapKey);
	return setMap(state, {
		...mapState,
		data: {
			...mapState.data,
			worldWindNavigator: mapState.data.worldWindNavigator ?
				{...mapState.data.worldWindNavigator, ...updates} : updates
		}
	});
};

const deprecated_updateSetWorldWindNavigator = (state, setKey, updates) => {
	return {
		...state,
		sets: {
			...state.sets,
			[setKey]: {
				...state.sets[setKey],
				data: {
					...state.sets[setKey].data,
					worldWindNavigator: state.sets[setKey].data.worldWindNavigator ?
						{...state.sets[setKey].data.worldWindNavigator, ...updates} : updates
				}
			}
		}
	};
};


export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.MAPS.SET_INITIAL:
			return setInitial();
		case ActionTypes.MAPS.SET_ACTIVE_MAP_KEY:
			return setActiveMapKey(state, action.mapKey);
		case ActionTypes.MAPS.SET_ACTIVE_SET_KEY:
			return setActiveSetKey(state, action.setKey); //TEST
		case ActionTypes.MAPS.SET.ADD:
			return addSet(state, action.set);
		case ActionTypes.MAPS.SET.REMOVE:
			return removeSet(state, action.setKey);
		case ActionTypes.MAPS.SET.ADD_MAP:
			return addMapKeyToSet(state, action.setKey, action.mapKey);
		case ActionTypes.MAPS.SET.REMOVE_MAP:
			return removeMapKeyFromSet(state, action.setKey, action.mapKey);
		case ActionTypes.MAPS.SET.SET_BACKGROUND_LAYER:
			return setSetBackgroundLayer(state, action.setKey, action.backgroundLayer);
		case ActionTypes.MAPS.SET.VIEW.SET:
			return setSetView(state, action.setKey, action.view);
		case ActionTypes.MAPS.SET.VIEW.UPDATE:
			return updateSetView(state, action.setKey, action.update);
		case ActionTypes.MAPS.SET.SET_ACTIVE_MAP_KEY:
			return setSetActiveMapKey(state, action.setKey, action.mapKey);
		case ActionTypes.MAPS.SET.SET_MAPS:
			return setSetMaps(state, action.setKey, action.maps);
		case ActionTypes.MAPS.SET.SET_SYNC:
			return setSetSync(state, action.setKey, action.sync);
		case ActionTypes.MAPS.MAP.ADD:
			return addMap(state, action.map);
		case ActionTypes.MAPS.MAP.LAYERS.SET.HOVERED_FEATURE_KEYS:
			return setMapLayerHoveredFeatureKeys(state, action.mapKey, action.layerKey, action.hoveredFeatureKeys);
		case ActionTypes.MAPS.MAP.REMOVE:
			return removeMap(state, action.mapKey);
		case ActionTypes.MAPS.MAP.SET_NAME:
			return setMapName(state, action.mapKey, action.name);
		case ActionTypes.MAPS.MAP.SET_DATA:
			return setMapData(state, action.mapKey, action.data);
		case ActionTypes.MAPS.MAP.VIEW.SET:
			return setMapView(state, action.mapKey, action.view);
		case ActionTypes.MAPS.MAP.VIEW.UPDATE:
			return updateMapView(state, action.mapKey, action.update);
		case ActionTypes.MAPS.LAYERS.LAYER.ADD:
			return addLayer(state, action.mapKey, action.layer, action.index);
		case ActionTypes.MAPS.LAYERS.LAYER.REMOVE:
			return removeLayer(state, action.mapKey, action.layerKey);
		case ActionTypes.MAPS.LAYERS.REMOVE_LAYERS:
			return removeLayers(state, action.mapKey, action.layersKeys);
		case ActionTypes.MAPS.LAYERS.LAYER.SET_INDEX:
			return setLayerIndex(state, action.mapKey, action.layerKey, action.index);
		case ActionTypes.MAPS.LAYERS.LAYER.UPDATE:
			return updateMapLayer(state, action.mapKey, action.layer, action.layerKey);
		case ActionTypes.MAPS.LAYERS.LAYER.SET:
			return setMapLayer(state, action.mapKey, action.layer, action.layerKey);
		case ActionTypes.MAPS.LAYERS.SET:
			return setMapLayers(state, action.mapKey, action.layers);
		case ActionTypes.MAPS.SET_SCOPE:
			return setMapScope(state, action.mapKey, action.scope);
		case ActionTypes.MAPS.SET_SCENARIO:
			return setMapScenario(state, action.mapKey, action.scenario);
		case ActionTypes.MAPS.SET_PERIOD:
			return setMapPeriod(state, action.mapKey, action.period);
		case ActionTypes.MAPS.SET_PLACE:
			return setMapPlace(state, action.mapKey, action.place);
		case ActionTypes.MAPS.SET_CASE:
			return setMapCase(state, action.mapKey, action.case);
		case ActionTypes.MAPS.SET_BACKGROUND_LAYER:
			return setMapBackgroundLayer(state, action.mapKey, action.backgroundLayer);
		case ActionTypes.MAPS.UPDATE:
			return update(state, action.data);

		// deprecated
		case ActionTypes.MAPS.SET.WORLD_WIND_NAVIGATOR.SET:
			return deprecated_setSetWorldWindNavigator(state, action.setKey, action.worldWindNavigator);
		case ActionTypes.MAPS.SET.WORLD_WIND_NAVIGATOR.UPDATE:
			return deprecated_updateSetWorldWindNavigator(state, action.setKey, action.worldWindNavigator);
		case ActionTypes.MAPS.MAP.WORLD_WIND_NAVIGATOR.SET:
			return deprecated_setMapWorldWindNavigator(state, action.mapKey, action.worldWindNavigator);
		case ActionTypes.MAPS.MAP.WORLD_WIND_NAVIGATOR.UPDATE:
			return deprecated_updateMapWorldWindNavigator(state, action.mapKey, action.worldWindNavigator);
		default:
			return state;
	}
}
