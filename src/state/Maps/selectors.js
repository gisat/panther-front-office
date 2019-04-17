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

/* TODO merge with template
*  TODO test
*/
/**
 * Collect and prepare data for map component
 *
 * @param state {Object}
 * @param layers {Array} Collection of layers data. Each object in collection contains filter property (it is used for selecting of relations) and data property (which contains data about layer from map state - e.g. key).
 */
const getLayers = createSelector(
	[
		SpatialDataSourcesSelectors.getFilteredGroupedByLayerKey,
		(state, layers) => (layers)
	],
	/**
	 * @param groupedSources {null | Object} Data sources grouped by layer key
	 * @param layers {null | Array}
	 * @return {null | Array} Collection of layers data for map component
	 */
	(groupedSources, layers) => {
		// FIXME - more complex
		if (groupedSources && layers) {
			let layersForMap = [];
			layers.forEach(layer => {
				let sourcesForLayer = groupedSources[layer.data.key];
				if (sourcesForLayer) {
					sourcesForLayer.forEach(source => {
						let key = `${layer.data.key}`;

						if (source) {
							key += `-${source.key}`;
							layersForMap.push({
								...source.data,
								key
							});
						} else {
							layersForMap.push({
								key
							});
						}
					});
				}
			});
			return layersForMap;
		} else {
			return null;
		}
	}
);

/**
 * @param state {Object}
 * @param mapKey {string}
 */
const getBackgroundLayerStateByMapKey = createSelector(
	[
		getMapByKey,
		getMapSetByMapKey,
		commonSelectors.getAllActiveKeys
	],
	(map, set, activeKeys) => {
		let layerTemplate = null;
		let filter = {
			place: null,
			period: null,
			case: null,
			scenario: null
		};
		if (map && map.data && map.data.backgroundLayer) {
			layerTemplate = map.data.backgroundLayer;
		} else if (set && set.data && set.data.backgroundLayer) {
			layerTemplate = set.data.backgroundLayer;
		}

		if (layerTemplate) {
			return getFiltersForUse({...filter, layerTemplate: layerTemplate.layerTemplate, key: layerTemplate.key}, activeKeys)
		} else {
			return null;
		}
	}
);

/**
 * @param state {Object}
 * @param mapKey {string}
 */
const getLayersStateByMapKey = createSelector(
	[
		getMapByKey,
		getMapSetByMapKey,
		commonSelectors.getAllActiveKeys
	],
	(map, mapSet, activeKeys) => {
		let setLayers = (mapSet && mapSet.data && mapSet.data.layers) || null;
		let mapLayers = (map && map.data && map.data.layers) || null;

		if (map && (mapLayers || setLayers)) {
			let layers = [...(setLayers || []), ...(mapLayers || [])];
			let modifiers = {};
			if (mapSet) {
				let a = mapSet.data.metadataModifiers;
				modifiers = {...modifiers, ...mapSet.data.metadataModifiers};
			}
			modifiers = {...modifiers, ...map.data.metadataModifiers};

			layers = layers.map(layer => {
				return getFiltersForUse({...modifiers, ...layer}, activeKeys);
			});

			return layers;
		} else {
			return null;
		}
	}
);


/**
 * @param state {Object}
 * @param mapKey {string}
 */
const getAllLayersStateByMapKey = createSelector(
	[
		getLayersStateByMapKey,
		getBackgroundLayerStateByMapKey
	],
	(layersState, backgroundLayerState) => {
		const backgroundLayerData = backgroundLayerState ? [getLayerState(backgroundLayerState)] : [];
		const layersData = layersState ? layersState.map(getLayerState) : [];
		return new Array(...layersData, ...backgroundLayerData);
	}
)

// ----- helpers ------
const getLayerState = (layer) => ({filter: layer.mergedFilter, data: layer.layer});


/**
 * Prepare filters for use from layers state
 * @param layer {Object} layer state
 * @param activeKeys {Object} Metadata active keys
 * @return {{filter, filterByActive, mergedFilter, layer}}
 */
function getFiltersForUse(layer, activeKeys) {
	let filter = {};
	let filterByActive = {};
	let mergedFilter = {};

	if (layer && layer.hasOwnProperty('scope')){
		filter.scopeKey = layer.scope;
	} else {
		filterByActive.scope = true;
		if (activeKeys && activeKeys.activeScopeKey) {
			mergedFilter.scopeKey = activeKeys.activeScopeKey;
		}
	}
	if (layer && layer.hasOwnProperty('place')){
		filter.placeKey = layer.place;
	} else {
		filterByActive.place = true;
		if (activeKeys && activeKeys.activePlaceKey) {
			mergedFilter.placeKey = activeKeys.activePlaceKey;
		}
	}
	if (layer && layer.hasOwnProperty('period')){
		filter.periodKey = layer.period;
	} else {
		filterByActive.period = true;
		if (activeKeys && activeKeys.activePeriodKey) {
			mergedFilter.periodKey = activeKeys.activePeriodKey;
		}
	}
	if (layer && layer.hasOwnProperty('case')){
		filter.caseKey = layer.case;
	} else {
		filterByActive.case = true;
		if (activeKeys && activeKeys.activeCaseKey) {
			mergedFilter.caseKey = activeKeys.activeCaseKey;
		}
	}
	if (layer && layer.hasOwnProperty('scenario')){
		filter.scenarioKey = layer.scenario;
	} else {
		filterByActive.scenario = true;
		if (activeKeys && activeKeys.activeScenarioKey) {
			mergedFilter.scenarioKey = activeKeys.activeScenarioKey;
		}
	}
	if (layer && layer.hasOwnProperty('layerTemplate')){
		filter.layerTemplateKey = layer.layerTemplate;
	}

	mergedFilter = {...filter, ...mergedFilter};

	return {
		layer: layer ? layer : null,
		filter,
		filterByActive,
		mergedFilter
	}
}

export default {
	getActiveMapKey,
	getActiveSetKey,

	getBackgroundLayerStateByMapKey,

	getFiltersForUse,

	getLayers,
	getLayersStateByMapKey,

	getMapByKey,
	getMapSetByKey,
	getMapSetByMapKey,
	getMapSetMapKeys,
	getMapSets,

	getMapLayersByMapKey, //TODO - test
	getMapLayerByMapKeyAndLayerKey,
	getAllLayersStateByMapKey,
	
	getMapsAsObject,
	getMapSetsAsObject,

	getNavigator,

	getSubstate
};