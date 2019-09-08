import {createSelector} from 'reselect';
import createCachedSelector from "re-reselect";
import _ from 'lodash';

import mapUtils from '../../utils/map';

import LayerTemplatesSelectors from '../LayerTemplates/selectors';
import SpatialDataSourcesSelectors from '../SpatialDataSources/selectors';
import AttributeDataSelectors from '../AttributeData/selectors';
import commonSelectors from "../_common/selectors";

import config from "../../config/index";
import * as path from "path";

const getSubstate = state => state.maps;

const getMapsAsObject = state => state.maps.maps;
const getMapSetsAsObject = state => state.maps.sets;

const getActiveSetKey = state => state.maps.activeSetKey;
const getActiveMapKey = state => state.maps.activeMapKey;

const getMaps = createSelector(
	[getMapsAsObject],
	(maps) => {
		if (maps && !_.isEmpty(maps)) {
			return Object.values(maps);
		} else {
			return null;
		}
	}
);

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

// TODO test
const getMapByMetadata = createSelector(
	[
		getMaps,
		(state, metadata) => metadata
	],
	(maps, metadata) => {
		if (maps && metadata) {
			let filtered =  _.filter(maps, (map) => {
				if (map.data && map.data.metadataModifiers) {
					return _.isMatch(map.data.metadataModifiers, metadata);
				} else {
					return false;
				}
			});
			if (filtered && filtered.length) {
				return filtered[0]; //TODO what if more maps are selected based on filter
			} else {
				return null;
			}
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

// TODO deprecated
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
const getView = createSelector(
	[
		getMapByKey,
		getMapSetByMapKey
	],
	(map, set) => {
		if (map) {
			if (set) {
				let mapView = map.data && map.data.view;
				let mapSetView = set.data && set.data.view;
				let view = mapUtils.mergeViews(mapSetView, mapView);
				return !_.isEmpty(view) ? view : null;
			} else {
				let view = map.data && map.data.view;
				return view && !_.isEmpty(view) ? view : null;
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

const getBackgroundLayer = (state, mapKey) => {
	let layerState = getBackgroundLayerStateByMapKey(state, mapKey);
	if (layerState) {
		let layerKey = 'pantherBackgroundLayer';

		let layers = [{
			// TODO
			data: {
				key: layerKey
			},
			filter: {
				layerTemplateKey: layerState.layerTemplateKey
			}
		}];

		let data = SpatialDataSourcesSelectors.getFilteredGroupedByLayerKey(state, layers);
		if (data && data[layerKey] && data[layerKey][0]) {
			let layerData = data[layerKey][0].data;
			let {attribution, nameInternal, type, ...options} = layerData;

			// TODO data source strucutre
			if (type === 'wmts') {
				options.url = options.urls[0];
			}
			if (type === 'wms') {
				let {url, ...params} = options;
				options = {
					params,
					url
				}
			}

			return {
				key: layerKey,
				type,
				options
			};
		} else {
			return null;
		}
	} else {
		return null;
	}
};

// TODO re-reselct
const getLayers = (state, mapKey) => {
	let layersState = getLayersStateByMapKey(state, mapKey);
	let activeKeys = commonSelectors.getAllActiveKeys(state);

	if (layersState) {
		let layers = layersState.map((layersState) => {
			return {
				data: {
					key: layersState.key
				},
				// TODO quick solution for geoinv - get filter properly!
				filter: {
					layerTemplateKey: activeKeys && activeKeys.activeLayerTemplateKey,
					periodKey: activeKeys && activeKeys.activePeriodKey,
					caseKey: activeKeys && activeKeys.activeCaseKey,
				}
			}
		});

		let data = SpatialDataSourcesSelectors.getFilteredGroupedByLayerKey(state, layers);

		if (data && !_.isEmpty(data)) {
			let mapLayers = [];

			layersState.forEach((layerState) => {
				let layerData = data[layerState.key];
				if (layerData) {
					layerData.forEach(layer => {

						// TODO quick solution for geoinv
						if (layer && layer.data && (layer.data.type === "vector" || layer.data.type === "raster")) {
							mapLayers.push({
								key: layerState.key + '_' + layer.key,
								type: "wms",
								options: {
									url: config.apiGeoserverWMSProtocol + "://" + path.join(config.apiGeoserverWMSHost, config.apiGeoserverWMSPath),
									params: {
										layers: layer.data.layerName
									}
								}
							});
						}
					});
				}
			});

			console.log("#### Map Layer name", mapLayers && mapLayers[0] && mapLayers[0].options.params.layers);
			return mapLayers;
		} else {
			return null;
		}
	} else {
		return null;
	}
};



// TODO re-reselect?
// TODO test
const getFilterByActiveByMapKey = createSelector(
	[
		getMapSetByMapKey,
		getMapByKey
	],
	(set, map) => {
		return (set.data.filterByActive || map.data.filterByActive) && {...set.data.filterByActive, ...map.data.filterByActive};
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
const getLayers_deprecated = createSelector(
	[
		SpatialDataSourcesSelectors.getFilteredGroupedByLayerKey,
		AttributeDataSelectors.getFilteredGroupedByLayerKey,
		(state, layers) => (layers)
	],
	/**
	 * @param groupedSources {null | Object} Data sources grouped by layer key
	 * @param layers {null | Array}
	 * @return {null | Array} Collection of layers data for map component
	 */
	(groupedSpatialSources, groupedAttributeSources, layers) => {
		// FIXME - more complex
		if (groupedSpatialSources && groupedAttributeSources && layers) {
			return layers.map((layer) => getLayerConfiguration(layer, groupedSpatialSources[layer.data.key], groupedAttributeSources[layer.data.key]));
		} else {
			return null;
		}
	}
);

const getMapBackgroundLayerStateByMapKey = createSelector(
	[
		getMapByKey
	],
	(map) => {
		if (map && map.data && map.data.backgroundLayer) {
			return map.data.backgroundLayer;
		} else {
			return null;
		}
	}
);

const getMapSetBackgroundLayerStateByMapKey = createSelector(
	[
		getMapSetByMapKey
	],
	(set) => {
		if (set && set.data && set.data.backgroundLayer) {
			return set.data.backgroundLayer;
		} else {
			return null;
		}
	}
);

const getBackgroundLayerStateByMapKey = createCachedSelector(
	[
		getMapBackgroundLayerStateByMapKey,
		getMapSetBackgroundLayerStateByMapKey,
	],
	(mapBackgroundLayer, setBackgroundLayer) => {
		return mapBackgroundLayer || setBackgroundLayer;
	}
)(
	(state, mapKey) => `${mapKey}`
);

/**
 * @param state {Object}
 * @param mapKey {string}
 */
const getBackgroundLayerStateByMapKey_deprecated = createSelector(
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

// TODO re-reselect
// TODO refactor?
/**
 * @param state {Object}
 * @param mapKey {string}
 */
const getLayersStateByMapKey = createSelector(
	[
		getMapByKey,
		getMapSetByMapKey,
		getFilterByActiveByMapKey
	],
	(map, set, mapFilterByActive) => {
		let setLayers = (set && set.data && set.data.layers) || null;
		let mapLayers = (map && map.data && map.data.layers) || null;

		if (map && (mapLayers || setLayers)) {
			let layers = [...(setLayers || []), ...(mapLayers || [])];
			let modifiers = {};
			if (set) {
				modifiers = set.data.metadataModifiers;
			}
			modifiers = {...modifiers, ...map.data.metadataModifiers};

			layers = layers.map(layer => {
				let layerMetadataModifiers = layer.metadataModifiers ? {...modifiers, ...layer.metadataModifiers} : modifiers;
				let layerFilterByActive = layer.filterByActive ? {...mapFilterByActive, ...layer.filterByActive} : mapFilterByActive;

				return {...layer, metadataModifiers: layerMetadataModifiers, filterByActive: layerFilterByActive};
			});

			// TODO return error for duplicates?
			return _.uniqBy(layers, 'key');
		} else {
			return null;
		}
	}
);

const getAllLayersStateByMapKey = createSelector(
	[
		getBackgroundLayerStateByMapKey,
		getLayersStateByMapKey
	],
	(backgroundLayer, layers) => {
		if (layers || backgroundLayer) {
			layers = layers || [];

			if (backgroundLayer) {
				// TODO do not create new object for background layer on change in layers
				backgroundLayer = {...backgroundLayer, key: 'pantherBackgroundLayer'};
				return [backgroundLayer, ...layers];
			}

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
const getLayersStateByMapKey_deprecated = createSelector(
	[
		getMapByKey,
		getMapSetByMapKey,
		commonSelectors.getAllActiveKeys,
		(state, mapKey, useActiveMetadataKeys) => useActiveMetadataKeys
	],
	(map, mapSet, activeKeys, useActiveMetadataKeys) => {
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
				return getFiltersForUse({...modifiers, ...layer}, activeKeys, useActiveMetadataKeys);
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
const getAllLayersStateByMapKey_deprecated = createSelector(
	[
		getLayersStateByMapKey_deprecated,
		getBackgroundLayerStateByMapKey_deprecated
	],
	(layersState, backgroundLayerState) => {
		const backgroundLayerData = backgroundLayerState ? [getLayerState(backgroundLayerState)] : [];
		const layersData = layersState ? layersState.map(getLayerState) : [];
		return new Array(...layersData, ...backgroundLayerData);
	}
)

// ----- helpers ------
const getLayerState = (layer) => ({filter: layer.mergedFilter, data: layer.layer});

const getLayerConfiguration = (layer, spatialSourcesForLayer, attributeSourcesForLayer) => {
	// let spatialSourcesForLayer = groupedSpatialSources[layer.data.key];
	let layerConfig = null;
	if (spatialSourcesForLayer) {
		//TODO
		//take only first datasource for now
		// spatialSourcesForLayer.forEach(source => {
		[spatialSourcesForLayer[0]].forEach(source => {
			let key = `${layer.data.key}`;
			let mapServerConfig = {
				wmsMapServerUrl: `${config.apiGeoserverWMSProtocol}://${config.apiGeoserverWMSHost}/${config.apiGeoserverWMSPath}`,
				wfsMapServerUrl: `${config.apiGeoserverWFSProtocol}://${config.apiGeoserverWFSHost}/${config.apiGeoserverWFSPath}`
			};

			if (source) {
				key += `-${source.key}`;
				layerConfig = {
					...source.data,
					spatialDataSourceKey: source.key,
					spatialRelationsData: source.spatialRelationData,
					key,
					mapServerConfig
				};
			} else {
				layerConfig = {
					key,
					mapServerConfig
				};
			}
		});
	}

	//add attribute relations data
	if (attributeSourcesForLayer && layerConfig) {
		attributeSourcesForLayer.forEach(source => {
			if (source) {
				const attributeLayerTemplateKey = source.attributeRelationData && source.attributeRelationData.layerTemplateKey;
				if(attributeLayerTemplateKey) {
					layerConfig.attributeRelationsData = source.attributeRelationData;
				}
			}
		});
	}
	return layerConfig;
};

/**
 * Prepare filters for use from layers state
 * @param layer {Object} layer state
 * @param activeKeys {Object} Metadata active keys
 * @param useMetadata {Object}
 * @return {{filter, filterByActive, mergedFilter, layer}}
 */
function getFiltersForUse(layer, activeKeys, useMetadata) {
	let filter = {};
	let filterByActive = {};
	let mergedFilter = {};

	if (layer && layer.hasOwnProperty('scope')){
		filter.scopeKey = layer.scope;
	} else if(!useMetadata || (useMetadata && useMetadata.scope)) {
		filterByActive.scope = true;
		if (activeKeys && activeKeys.activeScopeKey) {
			mergedFilter.scopeKey = activeKeys.activeScopeKey;
		}
	}
	if (layer && layer.hasOwnProperty('place')){
		filter.placeKey = layer.place;
	} else if(!useMetadata || (useMetadata && useMetadata.place)) {
		filterByActive.place = true;
		if (activeKeys && activeKeys.activePlaceKey) {
			mergedFilter.placeKey = activeKeys.activePlaceKey;
		}
	}
	if (layer && layer.hasOwnProperty('period')){
		filter.periodKey = layer.period;
	} else if(!useMetadata || (useMetadata && useMetadata.period)) {
		filterByActive.period = true;
		if (activeKeys && activeKeys.activePeriodKey) {
			mergedFilter.periodKey = activeKeys.activePeriodKey;
		}
	}
	if (layer && layer.hasOwnProperty('case')){
		filter.caseKey = layer.case;
	} else if(!useMetadata || (useMetadata && useMetadata.case)) {
		filterByActive.case = true;
		if (activeKeys && activeKeys.activeCaseKey) {
			mergedFilter.caseKey = activeKeys.activeCaseKey;
		}
	}
	if (layer && layer.hasOwnProperty('scenario')){
		filter.scenarioKey = layer.scenario;
	} else if(!useMetadata || (useMetadata && useMetadata.scenario)) {
		filterByActive.scenario = true;
		if (activeKeys && activeKeys.activeScenarioKey) {
			mergedFilter.scenarioKey = activeKeys.activeScenarioKey;
		}
	}

	if (layer && layer.hasOwnProperty('layerTemplate')){
		filter.layerTemplateKey = layer.layerTemplate;
	}
	
	if (layer && layer.hasOwnProperty('attribute')){
		filter.attributeKey = layer.attribute;
	} else if(!useMetadata || (useMetadata && useMetadata.attribute)) {
		filterByActive.attribute = true;
		if (activeKeys && activeKeys.activeAttributeKey) {
			mergedFilter.attributeKey = activeKeys.activeAttributeKey;
		}
	}

	mergedFilter = {...filter, ...mergedFilter};

	return {
		layer: layer ? layer : null,
		filter,
		filterByActive,
		mergedFilter
	}
}


/**
 * @param state {Object}
 * @param mapSetKey {string}
 * @returns {Array<Map> | null}
 */
const getMapsByMapSetKey = createSelector(
	[
		getMapsAsObject,
		getMapSetMapKeys
	],
	(maps, mapSetMapsKeys) => {
		if (maps && !_.isEmpty(maps) && mapSetMapsKeys && !_.isEmpty(mapSetMapsKeys)) {
			return mapSetMapsKeys.map(k => maps[k]);
		} else {
			return null;
		}
	}
);


const getLayerTemplatesKeysByMapSetKey = createSelector([
	getMapsByMapSetKey,
	getMapSetByKey,
],
(maps, mapSet) => {
	const layerTemplates = new Set();

	if(maps) {
		maps.forEach((map) => {
			if(map.data && map.data.layers && map.data.layers.length > 0) {
				layerTemplates.add(...map.data.layers.map(l => l.layerTemplate))
			}
		})
	}

	if(mapSet && mapSet.data && mapSet.data.layers && mapSet.data.layers.length > 0) {
		//if layers on mapSet
		layerTemplates.add(...mapSet.data.layers.map(l => l.layerTemplate));
	}
	return  [...layerTemplates];
})


const getLayersStateByMapSetKey = createSelector(
	[
		getMapSetByKey,
		getMapsByMapSetKey,
		commonSelectors.getAllActiveKeys,
	],
	(mapSet, maps, activeKeys) => {
		const mapsLayersState = {};
		let setLayers = (mapSet && mapSet.data && mapSet.data.layers) || null;
		
		maps.forEach((map) => {
			let mapLayers = (map && map.data && map.data.layers) || null;
			if (map && (mapLayers || setLayers)) {
				let layers = [...(setLayers || []), ...(mapLayers || [])];
				let modifiers = {};
				if (mapSet) {
					let a = mapSet.data.metadataModifiers;
					modifiers = {...modifiers, ...mapSet.data.metadataModifiers};
				}
				modifiers = {...modifiers, ...map.data.metadataModifiers};

				//TODO
				//specific for FUORE
				const useMetadata = {
					scope: true,
					attribute: true,
					period: true,
				}

				layers = layers.map(layer => {
					return getFiltersForUse({...modifiers, ...layer}, activeKeys, useMetadata);
				});

				mapsLayersState[map.key] = layers;
			}

		});

	return mapsLayersState;
	}
);

export default {
	getActiveMapKey,
	getActiveSetKey,

	getAllLayersStateByMapKey,
	getAllLayersStateByMapKey_deprecated,

	getBackgroundLayer,
	getBackgroundLayerStateByMapKey,
	getBackgroundLayerStateByMapKey_deprecated,

	getFilterByActiveByMapKey,
	getFiltersForUse, // TODO deprecated?

	getLayers,
	getLayers_deprecated,
	getLayersStateByMapKey,
	getLayersStateByMapKey_deprecated,
	getLayersStateByMapSetKey,
	getLayerTemplatesKeysByMapSetKey,

	getMapByKey,
	getMapByMetadata,
	getMapSetByKey,
	getMapSetByMapKey,
	getMapSetMapKeys,
	getMapSets,

	getMapLayersByMapKey, //TODO - test
	getMapLayerByMapKeyAndLayerKey,
	
	getMapsAsObject,
	getMapSetsAsObject,

	getNavigator, // TODO deprecated
	getView,

	getSubstate
};