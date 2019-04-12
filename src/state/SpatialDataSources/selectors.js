import {createSelector} from 'reselect';
import _ from 'lodash';

import vectorSelectors from './vector/selectors';
import common from "../_common/selectors";
import SpatialRelations from "../SpatialRelations/selectors";

const getSubstate = (state) => state.spatialDataSources;
const getAllAsObject = common.getAllAsObject(getSubstate);

/**
 * Collect and prepare data sources grouped by layer key
 *
 * @param state {Object}
 * @param layers {Array} Collection of layers data. Each object in collection contains filter property (it is used for selecting of relations) and data property (which contains data about layer from map state - e.g. key).
 */
const getFilteredGroupedByLayerKey = createSelector(
	[
		getAllAsObject,
		SpatialRelations.getDataSourceKeysGroupedByLayerKey
	],

	/**
	 * @param dataSources {null | Object} all available data sources
	 * @param groupedKeys {null | Object} Data sources keys grouped by layer key
	 * @return {null | Object} Data sources grouped by layer key
	 */
	(dataSources, groupedKeys) => {
		if (groupedKeys) {
			let groupedSources = {};
			_.forIn(groupedKeys, (keys, layerKey) => {
				let sources = [];
				keys.forEach(key => {
					if (key && dataSources && !_.isEmpty(dataSources) && dataSources[key]) {
						sources.push(dataSources[key]);
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

/**
 * @param state {Object}
 * @param filter {Object}
 * @returns {Array|null}
 */
const getFilteredData = createSelector(
	[
		getAllAsObject,
		(state, filter) => filter
	],
	(spatialDataSources, filter) => {
		if (spatialDataSources && spatialDataSources.length > 0 && filter && !_.isEmpty(filter)) {
			return _.filter(spatialDataSources, filter);
		} else {
			return null;
		}
	}
);

export default {
	getSubstate,

	getFilteredGroupedByLayerKey,
	getFilteredData,
	vector: vectorSelectors
};