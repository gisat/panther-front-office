import Select from "../Select";
import _ from "lodash";

function getIndex(indexes, filter, order) {
	if (indexes){
		// TODO re-reselect?
		let index = _.find(indexes, (index) => isCorrespondingIndex(index, filter, order));
		return index ? index : null;
	} else {
		return null;
	}
}

function isCorrespondingIndex(index, filter, order) {
	return _.isEqual(index.filter, filter) && _.isEqual(index.order, order);
}

function mergeFilters(activeKeys, filterByActive, filter) {
	if (activeKeys && filterByActive) {
		let fullFilter = {...filter};
		if (filterByActive.scope){
			if (activeKeys.activeScopeKey){
				fullFilter.scope = activeKeys.activeScopeKey;
			} else {
				return null;
			}
		}
		// TODO add case, scenario, ...
		if (filterByActive.place){
			if (activeKeys.activePlaceKey){
				fullFilter.place = activeKeys.activePlaceKey;
			} else if (activeKeys.activePlaceKeys){
				fullFilter.place = {key: {in: activeKeys.activePlaceKeys}};
			} else {
				return null;
			}
		}
		if (filterByActive.period){
			if (activeKeys.activePeriodKey){
				fullFilter.period = activeKeys.activePeriodKey;
			} else if (activeKeys.activePeriodKeys){
				fullFilter.period = {key: {in: activeKeys.activePeriodKeys}};
			} else {
				return null;
			}
		}
		return fullFilter;
	} else {
		return filter;
	}
}

export default {
	getIndex,
	mergeFilters,
	isCorrespondingIndex,
}