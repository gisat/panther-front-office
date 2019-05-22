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


const getChartConfiguration = createCachedSelector(
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
)(
	(state, chart) => `${chart && chart.key}`
);

const getDataForChart = createCachedSelector(
	[
		AttributeDataSelectors.getFilteredGroupedByFid,
		(state, filter, chart) => chart
	],
	(data, chart) => {
		if (chart && data) {
			return data;
		} else {
			return null;
		}
	}
)((state, filter, chart) => {return `${JSON.stringify(filter)}:${chart.key}`});

/* helpers */

/**
 * Prepare filters for use from layers state
 * @param data {Object} chart data
 * @param activeKeys {Object} Metadata active keys
 * @return {{filter, filterByActive, mergedFilter, data}}
 */

// TODO other metadata types
// TODO pass filterByActive?
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
		if (data.periods.length > 1) {
			filter.periodKey = {in: data.periods};
		} else {
			filter.periodKey = data.periods[0];
		}
	} else {
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
	getChartConfiguration,
	getChartsBySetKeyAsObject,
	getDataForChart,
	getSetByKey
}