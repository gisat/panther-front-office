import {createSelector} from 'reselect';
import _ from 'lodash';
import common from "../_common/selectors";

const getSubstate = (state) => state.spatialRelations;
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
 * @param relations {Array} collection of relation.data
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
 * @param relations {Array} collection of relation.data
 * @param filter {Array}
 */
const getFilteredDataGroupedByLayerKey = createSelector(
	[
		getAllData,
		(state, layers) => layers
	],
	(relations, layers) => {
		if (relations && layers && !_.isEmpty(layers)) {
			let groupedRelations = {};
			layers.forEach(layer => {
				if (layer.data && layer.data.key) {
					let filteredRelations = _.filter(relations, layer.filter);
					if (!_.isEmpty(filteredRelations)) {
						groupedRelations[layer.data.key] = filteredRelations;
					}
				}
			});
			return !_.isEmpty(groupedRelations) ? groupedRelations : null;
		} else {
			return null;
		}
	}
);

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

const getDataSourceKeysGroupedByLayerKey = createSelector(
	[getFilteredDataGroupedByLayerKey],
	(groupedRelations) => {
		if (groupedRelations) {
			let groupedDataSourceKeys = {};
			_.forIn(groupedRelations, (relationsData, layerKey) => {
				groupedDataSourceKeys[layerKey] = relationsData.map(relationData => relationData.dataSourceKey);
			});
			return !_.isEmpty(groupedDataSourceKeys) ? groupedDataSourceKeys : null;
		} else {
			return null;
		}
	}
);

export default {
	getDataSourceKeysFiltered,
	getDataSourceKeysGroupedByLayerKey,
	getSubstate
};