import Action from '../Action';
import Select from '../Select';

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
		const lastMapNumber = Number.parseInt(lastMapKey.match(/[\d+]/g).join(''));
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

export default {
    addMapAction,
    getNextMapKey,
}