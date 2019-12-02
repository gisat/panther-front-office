import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import _ from 'lodash';

import common from "../_common/selectors";
import AttributeRelations from "../AttributeRelations/selectors";

const getSubstate = (state) => state.attributeData;
const getAllAsObject = common.getAllAsObject(getSubstate);
const getBatchByFilterOrder = common.getBatchByFilterOrder(getSubstate);
const getByKey = common.getByKey(getSubstate);

const getFilteredDataGroupedByLayerKey = createCachedSelector(
	[
		AttributeRelations.getFilteredDataSourceKeysWithFidColumnGroupedByLayerKey,
		getAllAsObject,
		(state, layersWithFilter, layersState) => layersState
	],
	(attributeRelations, data, layersState) => {
		if (attributeRelations && data && !_.isEmpty(data)) {
			debugger;
		} else {
			return null;
		}
	}
)(
	(state, layersWithFilter, layersState) => {return JSON.stringify(layersState)}
);

// DEPRECATED -------------------------------------------

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
			_.map(filtered, filteredSource => {
				let source = allDataSources[filteredSource.attributeDataSourceKey];
				let keySource = filteredSource.fidColumnName;
				let nameSource = filteredSource.fidColumnName;

				if (source && source.attributeData && source.attributeData.features) {
					let features = source.attributeData.features;
					_.map(features, (feature) => {
						let key = feature.properties[keySource];
						let {[keySource]: keyName, ...props} = feature.properties;

						let values = [];
						let existingKey = data[key];

						_.map(props, (value, key) => {
							if (existingKey) {
								existingKey.data.values.push({key, value});
							} else {
								values.push({key, value});
							}
						});

						if (!existingKey) {
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
			return _.values(data);
		} else {
			return null;
		}
	}
)(
	(state, mergedFilter) => {
	return `${JSON.stringify(mergedFilter)}`;
}
);

const getNamesByFid = createCachedSelector(
	[
		getAllAsObject,
		AttributeRelations.getDataSourcesFromFilteredRelations
	],
	(allDataSources, filtered) => {
		if (allDataSources && !_.isEmpty(allDataSources) && filtered) {
			let data = {};
			if (filtered.length === 1) {
				let filteredSource = filtered[0];
				let source = allDataSources[filteredSource.attributeDataSourceKey];
				let keySource = filteredSource.fidColumnName;

				if (source && source.attributeData && source.attributeData.features) {
					let features = source.attributeData.features;
					_.map(features, (feature) => {
						let key = feature.properties[keySource];
						let {[keySource]: keyName, ...props} = feature.properties;

						data[key] = {
							key,
							data: {
								name: _.values(props)[0]
							}
						};
					});
				}

				return _.values(data);
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
)(
	(state, filter, cacheKey) => {
		return `${JSON.stringify(filter)}:${JSON.stringify(cacheKey)}`;
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
				_.map(keys,key => {
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

	getFilteredDataGroupedByLayerKey,

	getFilteredGroupedByFid,
	getNamesByFid,
};