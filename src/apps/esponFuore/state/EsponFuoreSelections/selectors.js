import {createSelector} from 'reselect';
import createCachedSelector from "re-reselect";
import _ from 'lodash';
import common from "../../../../state/_common/selectors";

const getSubstate = state => state.specific.esponFuoreSelections;
const getActive = common.getActive(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);

const getActiveAttributeFilterAnd = createSelector(
	[
		getActive
	],
	(active) => {
		if (active && active.data && active.data.attributeFilter && active.data.attributeFilter.and) {
			return active.data.attributeFilter.and;
		} else {
			return null;
		}
	}
);

const getActiveSelectionFilteredKeys = createSelector(
	[
		getActive
	],
	(selection) => {
		if (selection) {
			let attributeFilter = selection.data && selection.data.attributeFilter;
			// TODO merge with other filters
			return getMergedFilteredKeys(attributeFilter);
		} else {
			return null;
		}
	}
);

const getActiveSelectionFilteredKeysByPeriod = createCachedSelector(
	[
		getActive,
		(state, periodKey) => periodKey
	],
	(selection, periodKey) => {
		if (selection) {
			let attributeFilter = selection.data && selection.data.attributeFilter;
			// TODO merge with other filters
			return getMergedFilteredKeys(attributeFilter, periodKey);
		} else {
			return null;
		}
	}
)((state, periodKey) => periodKey);

const getActiveWithFilteredKeys = createSelector(
	[
		getActive,
		getActiveSelectionFilteredKeys
	],
	(selection, filteredKeys) => {
		if (selection && filteredKeys) {
			return {
				...selection,
				data: {
					...selection.data,
					filteredKeys
				}
			}
		} else {
			return null;
		}
	}
);

const getActiveWithFilteredKeysByPeriod = createSelector(
	[
		getActive,
		getActiveSelectionFilteredKeysByPeriod
	],
	(selection, filteredKeys) => {
		if (selection && filteredKeys) {
			return {
				...selection,
				data: {
					...selection.data,
					filteredKeys
				}
			}
		} else {
			return null;
		}
	}
);

// helpers
function getMergedFilteredKeys(filter, periodKey) {
	if (filter.filteredKeys) {
		return filter.filteredKeys;
	} else {
		if (filter.and) {
			let keysToMerge = [];
			filter.and.forEach(subfilter => {
				if (periodKey && subfilter.periodKey) {
					if (periodKey === subfilter.periodKey) {
						keysToMerge.push(getMergedFilteredKeys(subfilter, periodKey));
					}
				} else {
					keysToMerge.push(getMergedFilteredKeys(subfilter, periodKey));
				}
			});
			return _.intersection(...keysToMerge);
		} else if (filter.or) {
			let keysToUnion = [];
			filter.or.forEach(subfilter => {
				if (periodKey && subfilter.periodKey) {
					if (periodKey === subfilter.periodKey) {
						keysToUnion.push(getMergedFilteredKeys(subfilter, periodKey));
					}
				} else {
					keysToUnion.push(getMergedFilteredKeys(subfilter, periodKey));
				}
			});
			return _.union(...keysToUnion);
		} else {
			return null;
		}
	}
}

export default {
	getActive,
	getActiveAttributeFilterAnd,
	getActiveKey,
	getActiveWithFilteredKeys,
	getActiveWithFilteredKeysByPeriod
}