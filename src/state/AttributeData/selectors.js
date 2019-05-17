import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import _ from 'lodash';

import common from "../_common/selectors";
import AttributeRelations from "../AttributeRelations/selectors";

const getSubstate = (state) => state.attributeData;
const getAllAsObject = common.getAllAsObject(getSubstate);
const getBatchByFilterOrder = common.getBatchByFilterOrder(getSubstate);
const getByKey = common.getByKey(getSubstate);

/**
 * Collect and prepare data sources grouped by layer key
 *
 * @param state {Object}
 * @param filter {Object}
 *	 @param attributeKey {string}
 *	 @param scopeKey {string}
 *	 @param periodKey {string}
 *	 @param caseKey {string}
 *	 @param scenarioKey {string}
 *	 @param placeKey {string}
 */
const getFiltered = createSelector(
	[
		getAllAsObject,
		AttributeRelations.getDataSourceKeyFiltered
	],

	/**
	 * @param dataSources {null | Object} all available data sources
	 * @param dataSourceKey {String} Data sources key
	 * @return {null | Object} Data source
	 */
	(dataSources, dataSourceKey) => {
		if (dataSourceKey && dataSources && !_.isEmpty(dataSources) && dataSources[dataSourceKey]) {
			return dataSources[dataSourceKey];
		} else {
			return null;
		}
	}
);

const getFilteredGroupedByFid = createCachedSelector(
	[
		getAllAsObject,
		AttributeRelations.getDataSourcesFromFilteredRelations
	],
	(allDataSources, filtered) => {
		if (allDataSources && !_.isEmpty(allDataSources) && filtered) {

			let data = {};
			_.forEach(filtered, filteredSource => {
				let source = allDataSources[filteredSource.attributeDataSourceKey];
				let keySource = filteredSource.fidColumnName;
				let nameSource = filteredSource.fidColumnName; // TODO titleColumnName

				if (source && source.attributeData && source.attributeData.features) {
					let features = source.attributeData.features;
					_.forEach(features, (feature) => {
						let key = feature.properties[keySource];
						let props = {};
						_.forEach(feature.properties, (value, key) => {
							if (key !== keySource) {
								props[key] = value;
							}
						});

						let values = [];
						_.forEach(props, (value, key) => {
							values.push({key, value});
						});

						let existingKey = data[key];
						if (existingKey) {
							existingKey.data.values = [...existingKey.data.values, ...values];
						} else {
							data[key] = {
								key,
								data: {
									name: feature.properties[nameSource],
									values
								}
							};
						}
					});
				}
			});
			return !_.isEmpty(data) ? Object.values(data) : null;
		} else {
			return null;
		}
	}
)(
	(state, mergedFilter, chart) => {
	return `${JSON.stringify(mergedFilter)}:${chart.key}`;
}
);


/**
 * Collect and prepare data sources grouped by layer key
 *
 * @param state {Object}
 * @param layers {Array} Collection of layers data. Each object in collection contains filter property (it is used for selecting of relations) and data property (which contains data about layer from map state - e.g. key).
 */
const getFilteredGroupedByLayerKey = createSelector(
	[
		getAllAsObject,
		AttributeRelations.getDataSourceKeysGroupedByLayerKey,
		AttributeRelations.getDataSourceRelationsGroupedByLayerKey,
	],

	/**
	 * @param dataSources {null | Object} all available data sources
	 * @param groupedKeys {null | Object} Data sources keys grouped by layer key
	 * @return {null | Object} Data sources grouped by layer key
	 */
	(dataSources, groupedKeys, groupedRelations) => {
		if (groupedKeys) {
			let groupedSources = {};
			_.forIn(groupedKeys, (keys, layerKey) => {
				let sources = [];
				keys.forEach(key => {
					if (key && dataSources && !_.isEmpty(dataSources) && dataSources[key] && !_.isEmpty(groupedRelations) && groupedRelations[layerKey]) {
						sources.push({...dataSources[key], attributeRelationData: _.find(groupedRelations[layerKey], o => o.attributeDataSourceKey === key) || null});
					} else {
						sources.push(null);
					}
				});
				groupedSources[layerKey] = sources;
			});
			return groupedSources;
		} else {
			return null;
		}
	}
);

export default {
	getSubstate,
	getByKey,
	getFiltered,
	getBatchByFilterOrder,
	getFilteredGroupedByLayerKey,

	getFilteredGroupedByFid
};