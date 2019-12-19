import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";
import AttributeData from "../AttributeData/selectors";
import AttributeRelations from "../AttributeRelations/selectors";
import createCachedSelector from "re-reselect";

const getSubstate = (state) => state.attributeDataSources;
const getAllAsObject = common.getAllAsObject(getSubstate);
const getBatchByFilterOrder = common.getBatchByFilterOrder(getSubstate);
const getByKey = common.getByKey(getSubstate);
const getByKeys = common.getByKeys(getSubstate);

const getFilteredDataSources = createCachedSelector(
	[
		getAllAsObject,
		AttributeRelations.getFilteredDataSourceKeysWithFidColumn,
		AttributeData.getAllAsObject,
		(state, filter) => filter
	],
	(dataSources, dataSourcesWithFidColumn, attributeData, filter) => {
		if (!_.isEmpty(dataSourcesWithFidColumn) && attributeData && dataSources) {
			let finalDataSources = [];
			_.forEach(dataSourcesWithFidColumn, dataSourceWithFidColumn => {
				const key = dataSourceWithFidColumn.attributeDataSourceKey;
				let finalDataSource = {
					...dataSources[key]
				};

				const data = attributeData[key];
				if (data && data.attributeData && data.attributeData.features) {
					finalDataSource.data.features = data.attributeData.features.map(feature => {
						return {
							...feature,
							properties: {
								[dataSourceWithFidColumn.attributeKey]: feature.properties[finalDataSource.data.columnName],
								[dataSourceWithFidColumn.fidColumnName]: feature.properties[dataSourceWithFidColumn.fidColumnName]
							}
						};
					});
				}

				finalDataSources.push({
					dataSource: finalDataSource,
					attributeKey: dataSourceWithFidColumn.attributeKey,
					periodKey: dataSourceWithFidColumn.periodKey,
					fidColumnName: dataSourceWithFidColumn.fidColumnName
				});
			});

			return finalDataSources.length ? finalDataSources : null;

		} else {
			return null;
		}
	}
)((state, filter) => JSON.stringify(filter));

const getFilteredDataSourcesGroupedByLayerKey = createCachedSelector(
	[
		AttributeRelations.getFilteredDataSourceKeysWithFidColumnGroupedByLayerKey,
		getAllAsObject,
		AttributeData.getAllAsObject,
		(state, layersWithFilter, layersState) => layersState
	],
	(dataSourcesDataByLayerKey, dataSources, attributeData, layersState) => {
		if (dataSourcesDataByLayerKey && !_.isEmpty(dataSources)) {
			let dataSourcesGroupedByLayerKey = {};
			_.forIn(dataSourcesDataByLayerKey, (dataSourceKeysAndFidColumns, layerKey) => {
				dataSourcesGroupedByLayerKey[layerKey] = [];
				_.forEach(dataSourceKeysAndFidColumns, (dataSourceKeyAndFidColumn) => {
					if (dataSources[dataSourceKeyAndFidColumn.attributeDataSourceKey]) {
						let finalDataSource = {...dataSources[dataSourceKeyAndFidColumn.attributeDataSourceKey]};
						const data = attributeData[dataSourceKeyAndFidColumn.attributeDataSourceKey];
						if (data && data.attributeData && data.attributeData.features) {
							finalDataSource.data.features = data.attributeData.features.map(feature => {
								return {
									...feature,
									properties: {
										[dataSourceKeyAndFidColumn.attributeKey]: feature.properties[finalDataSource.data.columnName],
										[dataSourceKeyAndFidColumn.fidColumnName]: feature.properties[dataSourceKeyAndFidColumn.fidColumnName]
									}
								};
							});
						}

						dataSourcesGroupedByLayerKey[layerKey].push({
							dataSource: finalDataSource,
							attributeKey: dataSourceKeyAndFidColumn.attributeKey,
							fidColumnName: dataSourceKeyAndFidColumn.fidColumnName
						});
					}
				});
			});

			return dataSourcesGroupedByLayerKey;
		} else {
			return null;
		}
	}
)(
	(state, layersWithFilter, layersState) => {return JSON.stringify(layersState)}
);


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
				_.map(keys, key => {
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
	getFilteredDataSources,
	getFilteredDataSourcesGroupedByLayerKey,


	getFiltered,
	getBatchByFilterOrder,
	getFilteredGroupedByLayerKey,
	getByKey,
	getByKeys,
};