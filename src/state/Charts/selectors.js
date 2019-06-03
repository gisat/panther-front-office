import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import AttributeDataSelectors from "../AttributeData/selectors";
import _ from "lodash";

// TODO test all selectors
const getAllChartsAsObject = (state) => state.charts.charts;
const getChartByKey = (state, key) => state.charts.charts[key];
const getSetByKey = (state, key) => state.charts.sets[key];

const getChartsBySetKeyAsObject = createSelector(
	[
		getSetByKey,
		getAllChartsAsObject
	],
	(set, charts) => {
		if (set && set.charts && set.charts.length) {
			let setCharts= {};
			_.each(set.charts, (key) => {
				setCharts[key] = charts[key];
			});
			return setCharts;
		} else {
			return null;
		}
	}
);

// TODO other metadata types
const getMetadataActiveKeys = state => {
	return {
		activeScopeKey: state.scopes.activeKey,
		activePeriodKey: state.periods.activeKey,
		activePeriodKeys: state.periods.activeKeys,
		activeAttributeKey: state.attributes.activeKey
	};
};


const getChartConfiguration = createCachedSelector(
	[
		getChartByKey,
		getMetadataActiveKeys,
		(state, chart, useActiveMetadataKeys) => useActiveMetadataKeys
	],
	(chart, activeKeys, useActiveMetadataKeys) => {
		if (chart && activeKeys) {
			let filters = getFiltersForUse(chart.data, activeKeys, useActiveMetadataKeys);
			return {...chart, ...filters};
		} else {
			return null;
		}
	}
)(
	(state, chart) => `${chart && chart.key}`
);

const getDataForChart = createCachedSelector(
	[
		AttributeDataSelectors.getFilteredGroupedByFid,
		(state, filter, chartKey) => chartKey
	],
	(data, chartKey) => {
		if (chartKey && data) {
			return data;
		} else {
			return null;
		}
	}
)((state, filter, chartKey) => {return `${JSON.stringify(filter)}:${chartKey}`});

const getNamesForChart = createCachedSelector(
	[
		AttributeDataSelectors.getNamesByFid,
		(state, filter, cacheKey) => cacheKey
	],
	(data, cacheKey) => {
		if (cacheKey && data) {
			return data;
		} else {
			return null;
		}
	}
)((state, filter, cacheKey) => {return `${JSON.stringify(filter)}:${cacheKey}`});



/* helpers */

/**
 * Prepare filters for use from layers state
 * @param data {Object} chart data
 * @param activeKeys {Object} Metadata active keys
 * @param useActiveMetadataKeys {Object} Metadata active keys
 * @return {{filter, filterByActive, mergedFilter, data}}
 */

// TODO other metadata types
function getFiltersForUse(data, activeKeys, useActiveMetadataKeys) {
	let filter = {};
	let filterByActive = {};
	let mergedFilter = {};

	if (data && data.hasOwnProperty('scope')){
		filter.scopeKey = data.scope;
	} else if (useActiveMetadataKeys && useActiveMetadataKeys.scope) {
		filterByActive.scope = true;
		if (activeKeys && activeKeys.activeScopeKey) {
			mergedFilter.scopeKey = activeKeys.activeScopeKey;
		}
	}

	if (data && data.hasOwnProperty('periods')){
		if (data.periods.length > 1) {
			filter.periodKey = {in: data.periods};
		} else {
			filter.periodKey = data.periods[0];
		}
	} else if (useActiveMetadataKeys && useActiveMetadataKeys.period) {
		filterByActive.period = true;
		if (activeKeys && activeKeys.activePeriodKey) {
			mergedFilter.periodKey = activeKeys.activePeriodKey;
		} else if (activeKeys && activeKeys.activePeriodKeys) {
			mergedFilter.periodKey = {in: activeKeys.activePeriodKeys};
		}
	}

	if (data && data.hasOwnProperty('attributes')){
		if (data.attributes.length > 1) {
			filter.attributeKey = {in: data.attributes};
		} else {
			filter.attributeKey = data.attributes[0];
		}
	} else if (useActiveMetadataKeys && useActiveMetadataKeys.attribute) {
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
	getChartConfiguration,
	getChartsBySetKeyAsObject,
	getDataForChart,
	getNamesForChart,
	getSetByKey
}