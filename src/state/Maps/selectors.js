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

export default {
	getActiveMapKey: getActiveMapKey,
	getMaps: getMaps,
	getPeriodIndependence: getPeriodIndependence
};