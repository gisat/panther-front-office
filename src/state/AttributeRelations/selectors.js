import {createSelector} from 'reselect';
import _ from 'lodash';
import common from "../_common/selectors";

const getSubstate = (state) => state.attributeRelations;
const getAll = common.getAll(getSubstate);

const getAllData = createSelector(
	[getAll],
	(relations) => {
		if (relations) {
			return _.map(relations, relation => relation.data);
		} else {
			return null;
		}
	}
);

/**
 * @param state {Object}
 * @param filter {Object}
 */
const getFilteredData = createSelector(
	[
		getAllData,
		(state, filter) => filter
	],
	(relations, filter) => {
		if (relations && filter && !_.isEmpty(filter)) {
			return _.filter(relations, filter);
		} else {
			return null;
		}
	}
);

/**
 * Collect and prepare relations for given filters grouped by layer key
 *
 * @param state {Object}
 * @param layers {Array | null} Collection of layers data. Each object in collection contains filter property (it is used for selecting of relations) and data property (which contains data about layer from map state - e.g. key).
 */
const getFilteredDataGroupedByLayerKey = createSelector(
	[
		getAllData,
		(state, layers) => layers
	],
	/**
	 * @param relations {Array | null} list of all relations data
	 * @param layers {Array | null}
	 * @return {Object | null} Selected relations grouped by layer key
	 */
	(relations, layers) => {
		if (layers && !_.isEmpty(layers)) {
			let groupedRelations = {};
			layers.forEach(layer => {
				if (layer.data && layer.data.key) {
					if (relations) {
						let filteredRelations = _.filter(relations, layer.filter);
						if (!_.isEmpty(filteredRelations)) {
							groupedRelations[layer.data.key] = filteredRelations;
						} else {
							groupedRelations[layer.data.key] = [null];
						}
					} else {
						groupedRelations[layer.data.key] = [null];
					}
				}
			});
			return !_.isEmpty(groupedRelations) ? groupedRelations : null;
		} else {
			return null;
		}
	}
);

/**
 * @param state {Object}
 * @param filter {Object}
 */
const getDataSourceKeysFiltered = createSelector(
	[getFilteredData],
	(filteredRelations) => {
		if (filteredRelations && filteredRelations.length) {
			return _.map(filteredRelations, relation => relation.dataSourceKey);
		} else {
			return null;
		}
	}
);

/**
 * Collect and prepare data sources keys grouped by layer key
 *
 * @param state {Object}
 * @param layers {Array | null} Collection of layers data. Each object in collection contains filter property (it is used for selecting of relations) and data property (which contains data about layer from map state - e.g. key).
 */
const getDataSourceKeysGroupedByLayerKey = createSelector(
	[getFilteredDataGroupedByLayerKey],

	/**
	 * @param groupedRelations {null | Object} Relations grouped by layer key
	 * @return {null | Object} Data sources keys grouped by layer key
	 */
	(groupedRelations) => {
		if (groupedRelations) {
			let groupedDataSourceKeys = {};
			_.forIn(groupedRelations, (relationsData, layerKey) => {
				groupedDataSourceKeys[layerKey] = relationsData.map(relationData => {return relationData ? relationData.dataSourceKey : null});
			});
			return !_.isEmpty(groupedDataSourceKeys) ? groupedDataSourceKeys : null;
		} else {
			return null;
		}
	}
);

export default {
	getAllData,
	getDataSourceKeysFiltered,
	getDataSourceKeysGroupedByLayerKey,
	getFilteredData,
	getFilteredDataGroupedByLayerKey,
	getSubstate
};