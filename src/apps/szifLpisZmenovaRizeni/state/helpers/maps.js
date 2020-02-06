import Action from '../Action';
import Select from '../Select';
// import {removeItemByIndex, addItemToIndex, replaceItemOnIndex, removeItemByKey} from '../../../utils/stateManagement';
import {removeItemByKey, removeItemByIndex} from '../../../../utils/stateManagement';

/**
 * param {string} mapKeyTemplate - `szifLpisZmenovaRizeni-map-`
 * param {Array} mapKeys
 * returns {string}
 */
const getNextMapKey = (mapKeyTemplate, mapKeys) => {
    let mapKey;
    if(mapKeys) {
		mapKeys.sort();
		const lastMapKey = mapKeys[mapKeys.length - 1];
		const lastMapNumber = lastMapKey ? Number.parseInt(lastMapKey.match(/[\d+]/g).join('')) : 0;
		mapKey = `${mapKeyTemplate}${lastMapNumber + 1}`;
	} else {
		mapKey = `${mapKeyTemplate}1`;
    }
    return mapKey;
}

const addMapAction = (componentID, mapsComponentPath) => (dispatch, getState) => {
	const state = getState();
    const maps = Select.components.get(state, componentID, `${mapsComponentPath}`);
    const mapSetKey = Select.components.get(state, componentID, `${mapsComponentPath}.activeSetKey`);
	const mapSet = Select.components.get(state, componentID, `${mapsComponentPath}.sets.${mapSetKey}`);
    const mapKeys = mapSet.maps;
	const mapKey = getNextMapKey("szifLpisZmenovaRizeni-explorerMap-" ,mapKeys)
    
    const componentState = {...maps, sets: {...mapSet.sets, [mapSetKey]: {...mapSet, maps: [...mapSet.maps, mapKey]}}};
    return dispatch(Action.components.set(componentID, `${mapsComponentPath}`, componentState));
}

const removeActiveLayersByMapKey = (componentID, activeLayersComponentPath, mapKey) => (dispatch, getState) => {
    const state = getState();
    const activeLayers = Select.components.get(state, componentID, `${activeLayersComponentPath}`);
    const activeLayersWithoutMapKey = removeItemByKey(activeLayers, mapKey);
    return dispatch(Action.components.set(componentID, `${activeLayersComponentPath}`, activeLayersWithoutMapKey));
}

const removeMapAction = (componentID, mapsComponentPath, mapKey) => (dispatch, getState) => {
    const state = getState();
    const maps = Select.components.get(state, componentID, `${mapsComponentPath}`);
    const mapSetKey = Select.components.get(state, componentID, `${mapsComponentPath}.activeSetKey`);
	const sets = Select.components.get(state, componentID, `${mapsComponentPath}.sets`);
	const mapSet = Select.components.get(state, componentID, `${mapsComponentPath}.sets.${mapSetKey}`);

    const mapsWithoutMapByKey = removeItemByKey(maps.maps, mapKey);
    let newMaps = removeItemByKey(maps.maps, mapKey);
	// let newMapsState = {...state, maps: newMaps};
	//If mapKey is in sets, then remove it from each
	for (const [key, value] of Object.entries(sets)) {
		if(value.maps.includes(mapKey)) {
            const mapIndex = value.maps.indexOf(mapKey);
            newMaps = {
                        ...maps,
                        sets: {...newMaps.sets, [value.key]: {...value, maps: removeItemByIndex(value.maps, mapIndex)}},
                        maps: mapsWithoutMapByKey,
                    };
		}
	}

    //if active, set active first map
	if(mapSet.activeMapKey === mapKey) {
        newMaps = {...newMaps, sets: {...newMaps.sets, [mapSetKey]: {...newMaps.sets[mapSetKey], activeMapKey: newMaps.sets[mapSetKey].maps[0]}}}
	}

    return dispatch(Action.components.set(componentID, `${mapsComponentPath}`, newMaps));
}

export default {
    addMapAction,
    getNextMapKey,
    removeMapAction,
    removeActiveLayersByMapKey,
}