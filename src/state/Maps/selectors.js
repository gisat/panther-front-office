import {createSelector} from 'reselect';
import _ from 'lodash';

const getMapsAsObject = state => state.maps.maps;
const getMapSetsAsObject = state => state.maps.sets;

const getMapSets = createSelector(
	[getMapSetsAsObject],
	(sets) => {
		if (sets && !_.isEmpty(sets)) {
			return Object.values(sets);
		} else {
			return null;
		}
	}
);

/**
 * @param state {Object}
 * @param mapKey {string}
 */
const getMapByKey = createSelector(
	[getMapsAsObject,
	(state, key) => key],
	(maps, key) => {
		if (maps && !_.isEmpty(maps) && key) {
			return maps[key] ? maps[key] : null;
		} else {
			return null;
		}
	}
);

/**
 * @param state {Object}
 * @param setKey {string}
 */
const getMapSetByKey = createSelector(
	[getMapSetsAsObject,
	(state, key) => key],
	(sets, key) => {
		if (sets && !_.isEmpty(sets) && key) {
			return sets[key] ? sets[key] : null;
		} else {
			return null;
		}
	}
);

/**
 * @param state {Object}
 * @param mapKey {string}
 */
const getMapSetByMapKey = createSelector(
	[getMapSets,
	(state, mapKey) => (mapKey)],
	(sets, mapKey) => {
		if (sets && !_.isEmpty(sets) && mapKey) {
			let setForMap = null;
			sets.forEach((set) => {
				if (set.maps && _.includes(set.maps, mapKey)) {
					setForMap = set;
				}
			});
			return setForMap;
		} else {
			return null;
		}
	}
);

const getMapSetMapKeys = createSelector(
	[getMapSetByKey],
	(set) => {
		if (set && set.maps && set.maps.length) {
			return set.maps;
		} else {
			return null;
		}
	}
);

/**
 * @param state {Object}
 * @param mapKey {string}
 */
const getMapNavigator = createSelector(
	[getMapByKey,
	getMapSetByMapKey],
	(map, set) => {
		if (map) {
			if (set) {
				let mapNavigator = map.data && map.data.worldWindNavigator;
				let mapSetNavigator = set.data && set.data.worldWindNavigator;
				let navigator = {...mapSetNavigator, ...mapNavigator};
				return !_.isEmpty(navigator) ? navigator : null;
			} else {
				let navigator = map.data && map.data.worldWindNavigator;
				return navigator && !_.isEmpty(navigator) ? navigator : null;
			}
		} else {
			return null;
		}
	}
);

/**
 * @param state {Object}
 * @param mapKey {string}
 */
const getMapSync = createSelector(
	[getMapSetByMapKey],
	(set) => {
		if (set && set.sync) {
			return !_.isEmpty(set.sync) ? set.sync : null;
		} else {
			return null;
		}
	}
);

/**
 * @param state {Object}
 * @param mapKey {string}
 */
const getLayersByMapKey = createSelector(
	[getMapByKey],
	(map) => {
		if (map) {
			return map.data && map.data.layers || [];
		} else {
			return null;
		}
	}
);

/**
 * @param state {Object}
 * @param mapKey {string}
 * @param layerKey {string}
 */
const getLayerByMapKeyAndLayerKey = createSelector(
	[getLayersByMapKey, (state, mapKey, layerKey) => layerKey],
	(layers, layerKey) => {
		if (layers && layerKey) {
			return layers.find(l => l.key === layerKey)
		} else {
			return null;
		}
	}
);

export default {
	getMapByKey,
	getMapNavigator,
	getMapSetByKey,
	getMapSetByMapKey,
	getMapSetMapKeys,
	getMapSets,
	getMapSync,
	getLayersByMapKey, //TODO - test
	getLayerByMapKeyAndLayerKey,

	getMapsAsObject,
	getMapSetsAsObject,
	getSets: getMapSetsAsObject
};