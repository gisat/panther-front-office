import {createSelector} from 'reselect';
import _ from 'lodash';

import LayerTemplatesSelectors from '../LayerTemplates/selectors';
import SpatialDataSourcesSelectors from '../SpatialDataSources/selectors';
import commonSelectors from "../_common/selectors";

const getSubstate = state => state.maps;

const getMapsAsObject = state => state.maps.maps;
const getMapSetsAsObject = state => state.maps.sets;

const getActiveSetKey = state => state.maps.activeSetKey;
const getActiveMapKey = state => state.maps.activeMapKey;

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
const getNavigator = createSelector(
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
const getMapLayersByMapKey = createSelector(
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
const getMapLayerByMapKeyAndLayerKey = createSelector(
	[getMapLayersByMapKey, (state, mapKey, layerKey) => layerKey],
	(layers, layerKey) => {
		if (layers && layerKey) {
			return layers.find(l => l.key === layerKey)
		} else {
			return null;
		}
	}
);

/**
 * @param state {Object}
 * @param layerTemplateKey {string}
 */
const getBackgroundLayer = createSelector(
	[LayerTemplatesSelectors.getByKey,
	SpatialDataSourcesSelectors.getByLayerTemplateKey],
	(layerTemplate, dataSource) => {
		if (layerTemplate && dataSource) {
			if (_.isArray(dataSource)) dataSource = dataSource[0];
			let key = `${layerTemplate.key}-${dataSource.key}`;
			return {
				key,
				data: {
					...dataSource.data,
					key,
					name: layerTemplate.displayName ? layerTemplate.displayName : null,
				}
			}
		} else {
			return null;
		}
	}
);

const getBackgroundLayerStateByMapKey = createSelector(
	[getMapByKey,
	getMapSetByMapKey],
	(map, set) => {
		if (map && map.data && map.data.backgroundLayer) {
			return map.data.backgroundLayer;
		} else if (set && set.data && set.data.backgroundLayer) {
			return set.data.backgroundLayer;
		} else {
			return null;
		}
	}
);

const getLayersStateByMapKey = createSelector(
	[
		getMapByKey,
		getMapSetByMapKey
	],
	(map, set) => {
		let setLayers = (set && set.data && set.data.layers) || null;
		let mapLayers = (map && map.data && map.data.layers) || null;

		if (map && (mapLayers || setLayers)) {
			let layers = [...(setLayers || []), ...(mapLayers || [])];
			let modifiers = {};
			if (set) {
				modifiers = {...modifiers, ...set.metadataModifiers};
			}
			modifiers = {...modifiers, ...map.metadataModifiers};

			layers = layers.map(layer => {
				return {...modifiers, ...layer};
			});

			return layers;
		} else {
			return null;
		}
	}
);

export default {
	getActiveMapKey,
	getActiveSetKey,

	getBackgroundLayer,
	getBackgroundLayerStateByMapKey,

	getLayersStateByMapKey,

	getMapByKey,
	getMapSetByKey,
	getMapSetByMapKey,
	getMapSetMapKeys,
	getMapSets,

	getMapLayersByMapKey, //TODO - test
	getMapLayerByMapKeyAndLayerKey,

	getMapsAsObject,
	getMapSetsAsObject,

	getNavigator,

	getSubstate
};