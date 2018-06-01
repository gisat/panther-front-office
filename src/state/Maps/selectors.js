import {createSelector} from 'reselect';
import _ from 'lodash';
import Select from '../Select'

const getMapDefaults = state => state.maps.defaults;
const getMapsOverrides = state => state.maps.data;
const getActiveMapKey = state => state.maps.activeMapKey;
const getPeriodIndependence = state => state.maps.independentOfPeriod;

const getActivePlaceKey = state => state.places.activeKey;
const getSpatialRelations = (state) => state.spatialRelations.data;
const getSpatialDataSources = (state) => state.spatialDataSources.data;

const getMaps = createSelector(
	[getMapDefaults, getMapsOverrides],
	(defaults, overrides) => {
		return _.map(overrides, override => {
			return {...defaults, ...override};
		});
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
					return relationsForTemplates.map(relation => {
						let dataSource = _.find(sources, {'key': relation.data_source_id});
						let layerTemplate = relation.layer_template_id;
						let scenario = relation.scenario_id;
						let template = _.find(templates, {'templateId': relation.layer_template_id});
						return {
							dataSource: dataSource.data.layer_name,
							layerTemplateKey: layerTemplate,
							scenarioKey: scenario,
							styleSource: template.styles ? template.styles : null,
							key: relation.key
						}
					});
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


function filter (models, key, data){
	return _.filter(models, model => {
		return _.find(data, (value) => {return value === model[key]});
	});
}



export default {
	getActiveBackgroundLayerKey: getActiveBackgroundLayerKey,
	getActiveMapKey: getActiveMapKey,
	getActiveMap: getActiveMap,
	getActivePlaceActiveLayers: getActivePlaceActiveLayers,
	getMapKeys: getMapKeys,
	getMaps: getMaps,
	getMapsOverrides: getMapsOverrides,
	getMapDefaults: getMapDefaults,
	getPeriodIndependence: getPeriodIndependence
};