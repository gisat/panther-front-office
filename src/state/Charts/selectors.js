import {createSelector} from 'reselect';

// TODO test all selectors

const getChartByKey = (state, key) => state.charts.charts[key];

// TODO make common?
// TODO scenarios, cases
const getMetadataActiveKeys = state => {
	return {
		activeScopeKey: state.scopes.activeKey,
		activePeriodKey: state.periods.activeKey,
		activePeriodKeys: state.periods.activeKeys,
		activeAttributeKey: state.attributes.activeKey
	};
};

const getChartConfiguration = createSelector(
	[
		getChartByKey,
		getMetadataActiveKeys,
	],
	(chart, activeKeys) => {
		if (chart && activeKeys) {
			let filters = getFiltersForUse(chart.data, activeKeys);
			return {...chart, ...filters};
		} else {
			return null;
		}
	}
);

/* helpers */

/**
 * Prepare filters for use from layers state
 * @param data {Object} chart data
 * @param activeKeys {Object} Metadata active keys
 * @return {{filter, filterByActive, mergedFilter, data}}
 */

// TODO other metadata types
function getFiltersForUse(data, activeKeys) {
	let filter = {};
	let filterByActive = {};
	let mergedFilter = {};

	if (data && data.hasOwnProperty('scope')){
		filter.scopeKey = data.scope;
	} else {
		filterByActive.scope = true;
		if (activeKeys && activeKeys.activeScopeKey) {
			mergedFilter.scopeKey = activeKeys.activeScopeKey;
		}
	}

	if (data && data.hasOwnProperty('periods')){
		filter.periodKey = data.periods;
	} else {
		filterByActive.period = true;
		if (activeKeys && activeKeys.activePeriodKey) {
			mergedFilter.periodKey = activeKeys.activePeriodKey;
		} else if (activeKeys && activeKeys.activePeriodKeys) {
			mergedFilter.periodKey = {in: activeKeys.activePeriodKeys};
		}
	}

	if (data && data.hasOwnProperty('attributes')){
		filter.attributeKey = data.attributes;
	} else {
		filterByActive.attribute = true;
		if (activeKeys && activeKeys.activeAttributeKey) {
			mergedFilter.attributeKey = activeKeys.activeAttributeKey;
		} else if (activeKeys && activeKeys.activeAttributeKeys) {
			mergedFilter.attributeKey = {in: activeKeys.activeAttributeKeys};
		}
	}

	if (data && data.hasOwnProperty('layerTemplate')){
		filter.layerTemplateKey = data.layerTemplate;
	}

	mergedFilter = {...filter, ...mergedFilter};

	return {
		filter,
		filterByActive,
		mergedFilter
	}
}

export default {
	getChartConfiguration
}