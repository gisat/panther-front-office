import Select from "../Select";
import _ from "lodash";

function getIndex(indexes, filter, order) {
	if (indexes){
		// TODO re-reselect?
		let index = _.find(indexes, (index) => {
			return _.isEqual(index.filter, filter) && _.isEqual(index.order, order);
		});
		return index ? index : null;
	} else {
		return null;
	}
}

function mergeFilters(activeKeys, filterByActive, filter) {
	if (activeKeys && filterByActive) {
		let fullFilter = {...filter};
		if (filterByActive.scope){
			if (activeKeys.activeScopeKey){
				// TODO change dataset to scope
				fullFilter.dataset = activeKeys.activeScopeKey;
			} else {
				return null;
			}
		}
		// TODO remove theme, add case, scenario, ...
		if (filterByActive.theme){
			if (activeKeys.activeThemeKey){
				fullFilter.theme = activeKeys.activeThemeKey;
			} else {
				return null;
			}
		}
		if (filterByActive.place){
			if (activeKeys.activePlaceKey){
				fullFilter.place = activeKeys.activePlaceKey;
			} else if (activeKeys.activePlaceKeys){
				fullFilter.place = {key: {in: activeKeys.activePlaceKeys}};
			} else {
				return null;
			}
		}
		if (filterByActive.periods){
			if (activeKeys.activePeriodKey){
				fullFilter.periods = activeKeys.activePeriodKey;
			} else if (activeKeys.activePeriodKeys){
				fullFilter.periods = {key: {in: activeKeys.activePeriodKeys}};
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
	mergeFilters
}