import {createSelector} from 'reselect';
import _ from 'lodash';

const getMapDefaults = state => state.maps.defaults;
const getMapsOverrides = state => state.maps.data;
export const getActiveMapKey = state => state.maps.activeMapKey;

export const getMaps = createSelector(
	[getMapDefaults, getMapsOverrides],
	(defaults, overrides) => {
		return _.map(overrides, override => {
			return _.merge(defaults, override);
		});
	}
);