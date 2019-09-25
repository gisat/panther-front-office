import {createSelector} from 'reselect';
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

// helpers
function getMergedFilteredKeys(filter) {
	if (filter.filteredKeys) {
		return filter.filteredKeys;
	} else {
		if (filter.and) {
			let keysToMerge = filter.and.map(subfilter => {
				return getMergedFilteredKeys(subfilter);
			});
			return _.intersection(...keysToMerge);
		} else if (filter.or) {
			let keysToUnion = filter.or.map(subfilter => {
				return getMergedFilteredKeys(subfilter);
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
	getActiveWithFilteredKeys
}