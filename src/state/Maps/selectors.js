import {createSelector} from 'reselect';
import _ from 'lodash';

const getMapDefaults = state => state.maps.defaults;
const getMapsOverrides = state => state.maps.data;
const getActiveMapKey = state => state.maps.activeMapKey;
const getPeriodIndependence = state => state.maps.independentOfPeriod;

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

export default {
	getActiveBackgroundLayerKey: getActiveBackgroundLayerKey,
	getActiveMapKey: getActiveMapKey,
	getActiveMap: getActiveMap,
	getMaps: getMaps,
	getMapsOverrides: getMapsOverrides,
	getMapDefaults: getMapDefaults,
	getPeriodIndependence: getPeriodIndependence
};