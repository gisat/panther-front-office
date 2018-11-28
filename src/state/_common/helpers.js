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

function mergeFilters(state, filterByActive, filter) {
	let fullFilter = {...filter};
	if (filterByActive) {
		if (filterByActive.scope){
			let activeScopeKey = Select.scopes.getActiveKey(state);
			if (activeScopeKey){
				// TODO change dataset to scope
				fullFilter.dataset = activeScopeKey;
			} else {
				return null;
			}
		}
		// TODO remove theme, add case, scenario, ...
		if (filterByActive.theme){
			let activeThemeKey = Select.themes.getActiveKey(state);
			if (activeThemeKey){
				fullFilter.theme = activeThemeKey;
			} else {
				return null;
			}
		}
		if (filterByActive.place){
			let activePlaceKey = Select.places.getActiveKey(state);
			let activePlaceKeys = Select.places.getActiveKeys(state);
			if (activePlaceKey){
				fullFilter.place = activePlaceKey;
			} else if (activePlaceKeys){
				fullFilter.place = {in: activePlaceKeys};
			} else {
				return null;
			}
		}
		if (filterByActive.periods){
			let activePeriodKey = Select.periods.getActiveKey(state);
			let activePeriodsKeys = Select.periods.getActiveKeys(state);
			if (activePeriodKey){
				fullFilter.periods = activePeriodKey;
			} else if (activePeriodsKeys){
				fullFilter.periods = {in: activePeriodsKeys};
			} else {
				return null;
			}
		}
	}
	return fullFilter;
}

export default {
	getIndex,
	mergeFilters
}