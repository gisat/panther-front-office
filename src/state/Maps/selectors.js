import {createSelector} from 'reselect';
import _ from 'lodash';
import Select from '../Select'

const getMapDefaults = state => state.maps.defaults;
const getMapsOverrides = state => state.maps.data;
const getActiveMapKey = state => state.maps.activeMapKey;
const getPeriodIndependence = state => state.maps.independentOfPeriod;

const getActivePlaceKey = state => state.places.activeKey;
const getSpatialRelations = (state) => state.spatialRelations.data;
const getSpatialDataSources = (state) => state.spatialDataSources.main.data; //todo should use Select? if not circular

const getWmsLayers = (state) => state.wmsLayers.data;

const getMaps = createSelector(
	[getMapDefaults, getMapsOverrides],
	(defaults, overrides) => {
		return _.map(overrides, override => {
			return {...defaults, ...override};
		});
	}
);

const getMapsCount = createSelector(
	[getMaps],
	(maps) => {
		return maps ? maps.length : 0
	}
);

const getMapKeys = createSelector(
	[getMaps],
	(maps) => {
		return maps.map(map => {
			return map.key;
		});
	}
);

const getActiveMapOrder = createSelector(
	[getMapKeys, getActiveMapKey],
	(keys, activeKey) => {
		return _.indexOf(keys, activeKey);
	}
);

const getNavigator = createSelector(
	[getMapDefaults],
	(defaults) => {
		return defaults && defaults.navigator ? defaults.navigator : null;
	}
);

const getActiveMap = createSelector(
	[getMaps, getActiveMapKey],
	(maps, activeMapKey) => {
		return _.find(maps, {key: activeMapKey});
	}
);

const getActiveBackgroundLayerKey = createSelector(
	[getMapDefaults],
	defaults => {
		if (defaults && defaults.activeBackgroundLayerKey){
			return defaults.activeBackgroundLayerKey
		} else {
			return null;
		}
	}
);

const getActiveLayerTemplates = createSelector(
	[getMapDefaults],
	(defaults) => {
		if (defaults && defaults.layerTemplates){
			return defaults.layerTemplates;
		} else {
			return [];
		}
	}
);

const getActiveLayerTemplateIds = createSelector(
	[getMapDefaults],
	(defaults) => {
		if (defaults && defaults.layerTemplates){
			let templates = defaults.layerTemplates;
			return templates.map(template => {return template.templateId});
		} else {
			return [];
		}
	}
);

const getActivePlaceActiveLayers = createSelector(
	[getActivePlaceKey, getActiveLayerTemplates, getActiveLayerTemplateIds, getSpatialRelations, getSpatialDataSources],
	(place, templates, templateIds, relations, sources) => {
		if (place && templateIds.length && relations.length && sources.length){
			let relationsForPlace = _.filter(relations, ['place_id', place]);
			if (relationsForPlace){
				let relationsForTemplates = _.filter(relationsForPlace, model => {
					return _.find(templateIds, (value) => {return value === model['layer_template_id']});
				});
				if (relationsForTemplates){
					let usedRelations = [];
					relationsForTemplates.map(relation => {
						let dataSource = _.find(sources, {'key': relation.data_source_id});
						let layerTemplate = relation.layer_template_id;
						let scenario = relation.scenario_id;
						let template = _.find(templates, {'templateId': relation.layer_template_id});
						if (!dataSource){
							console.warn("Maps.selectors#getActivePlaceActiveLayers Data source with given key doesn't exist. Key: ",relation.data_source_id);
						} else {
							usedRelations.push({
								dataSource: dataSource.data.layer_name,
								layerTemplateKey: layerTemplate,
								scenarioKey: scenario,
								styleSource: template.styles ? template.styles : null,
								key: relation.key
							});
						}
					});
					return usedRelations;
				} else {
					return [];
				}
			} else {
				return [];
			}
		} else {
			return [];
		}
	}
);

const getAnalyticalUnitsVisibility = createSelector(
	[getMapDefaults],
	(defaults) => {
		return (defaults && defaults.hasOwnProperty('analyticalUnitsVisibility') ? defaults.analyticalUnitsVisibility : null);
	}
);

/**
 * Specific usage of getVectorLayersForTemplate selector, where layer template key is known from scope configuration
 */
const getVectorLayersForPuscVectorSourceTemplate = createSelector(
	[(state) => getVectorLayersForTemplate(state, Select.scopes.getPucsSourceVectorLayerTemplate(state))],
	(vectorLayers) => {
		return vectorLayers;
	}
);

const getVectorLayersForTemplate = createSelector(
	[(state, template) => (template), getSpatialRelations, getSpatialDataSources],
	(layerTemplate, relations, sources) => {
		if (layerTemplate && relations.length && sources.length){
			let relationsForTemplate = _.filter(relations, ['layer_template_id', layerTemplate]);
			if (relationsForTemplate){
				let vectorSources = [];
				relationsForTemplate.map(relation => {
					let dataSource = _.find(sources, {'key': relation.data_source_id, 'type': 'shapefile'});
					let scenario = relation.scenario_id;
					if (dataSource){
						vectorSources.push({
							dataSource: dataSource.data.layer_name,	// todo prejmenovat na neco vhodneho
							scenarioKey: scenario,
							relationKey: relation.key,
							dataSourceKey: dataSource.key
						});
					}
				});
				return vectorSources;
			} else {
				return [];
			}
		} else {
			return [];
		}
	}
);

const getUsedSourcesForAllMaps = createSelector(
	[getMaps, getWmsLayers],
	(maps, wmsLayers) => {
		let sources = [];
		maps.forEach((map) => {
			if(map.hasOwnProperty('layerPeriods') && map.layerPeriods) {
				Object.keys(map.layerPeriods).forEach((wmsLayerKey) => {
					let wmsLayer = _.find(wmsLayers, {key: Number(wmsLayerKey)});
					if(wmsLayer) {
						sources.push(`${wmsLayer.name} - ${map.layerPeriods[Number(wmsLayerKey)]}`);
					}
				})
			}
			if(map.hasOwnProperty('wmsLayers') && map.wmsLayers && map.wmsLayers.length) {
				map.wmsLayers.forEach((wmsLayerKey) => {
					let wmsLayer = _.find(wmsLayers, {key: wmsLayerKey});
					if(wmsLayer) {
						sources.push(wmsLayer.name);
					}
				});
			}
		});
		return sources;
	}
);

export default {
	getActiveBackgroundLayerKey: getActiveBackgroundLayerKey,
	getActiveMapKey: getActiveMapKey,
	getActiveMap: getActiveMap,
	getActiveMapOrder: getActiveMapOrder,
	getActivePlaceActiveLayers: getActivePlaceActiveLayers,
	getVectorLayersForTemplate: getVectorLayersForTemplate,
	getVectorLayersForPuscVectorSourceTemplate: getVectorLayersForPuscVectorSourceTemplate,
	getMapKeys: getMapKeys,
	getMaps: getMaps,
	getMapsCount: getMapsCount,
	getMapsOverrides: getMapsOverrides,
	getMapDefaults: getMapDefaults,
	getNavigator: getNavigator,
	getPeriodIndependence: getPeriodIndependence,
	getUsedSourcesForAllMaps
};