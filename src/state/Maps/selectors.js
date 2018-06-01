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
			let templates = defaults.layerTemplates;
			return templates.map(template => {return template.templateId});
		} else {
			return [];
		}
	}
);

const getActiveLayers = createSelector(
	[getActivePlaceKey, getActiveLayerTemplates, getSpatialRelations, getSpatialDataSources],
	(place, templates, relations, sources) => {
		if (place && templates.length && relations.length && sources.length){
			let realtionsForPlace = filter(relations, 'place_id', [place]);
			debugger;
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
	getActiveLayers: getActiveLayers,
	getMaps: getMaps,
	getMapsOverrides: getMapsOverrides,
	getMapDefaults: getMapDefaults,
	getPeriodIndependence: getPeriodIndependence
};