import {createSelector} from 'reselect';
import _ from 'lodash';

const getMapSetsAsObject = state => state.maps.sets;

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

export default {
	getMapSetByKey,
	getMapSetMapKeys,
	getMapSetsAsObject
};