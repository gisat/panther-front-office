import {createSelector} from 'reselect';
import _, {isEmpty} from 'lodash';
import common from "../_common/selectors";
import createCachedSelector from "re-reselect";

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
const getFiltered = createSelector(
	[
		getAllData,
		(state, filter) => filter
	],
	(relations, filter) => {
		if (relations && relations.length > 0 && filter && !_.isEmpty(filter)) {
			return _.filter(relations, filter);
		} else {
			return null;
		}
	}
);

const getFilteredRelations = createCachedSelector(
	[
		getAllData,
		(state, filter) => filter
	],
	(relations, filter) => {
		if (relations && relations.length > 0 && filter && !_.isEmpty(filter)) {
			return _.filter(relations, (relation) => {
				let fitsFilter = true;
				_.forIn(filter, (value, key) => {
					if (relation.hasOwnProperty(key)){
						if (_.isObject(value) && value.in && _.isArray(value.in)){
							if (!_.includes(value.in, relation[key])){
								fitsFilter = false;
							}
						} else if (relation[key] !== value){
							fitsFilter = false;
						}
					}
				});
				return fitsFilter;
			});
		} else {
			return null;
		}
	}
)((state, filter) => {
	return `${JSON.stringify(filter)}`
});

const getDataSourcesFromFilteredRelations = createCachedSelector(
	[
		getFilteredRelations
	],
	(filteredRelations) => {
		if (filteredRelations) {
			return filteredRelations.map(relation => {
				return {
					attributeDataSourceKey: relation.attributeDataSourceKey,
					fidColumnName: relation.fidColumnName
				}
			});
		} else {
			return null
		}
	}
)((state, filter) => {
	return `${JSON.stringify(filter)}`
});

/**
 * @param state {Object}
 * @param filter {Object}
 * 
 * filter
 * {
 * 	layerTemplateKey
 *	scopeKey
 *	periodKey
 *	caseKey
 *	scenarioKey
 *	placeKey
 *	attributeKey
 * }
 */
const getDataSourceKeyFiltered = createSelector(
	[getFiltered],
	(filteredRelations) => {
		if(filteredRelations && !isEmpty(filteredRelations)) {
			//relation is only for one data, so return first
			return filteredRelations[0].dataSourceKey;
		} else {
			return null;
		}
		// if (filteredRelations && filteredRelations.length) {
		// 	return _.find(filteredRelations, relation => relation.dataSourceKey);
		// } else {
		// 	return null;
		// }
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
 * Collect and prepare data relations grouped by layer key
 *
 * @param state {Object}
 * @param layers {Array | null} Collection of layers data. Each object in collection contains filter property (it is used for selecting of relations) and data property (which contains data about layer from map state - e.g. key).
 */
const getDataSourceRelationsGroupedByLayerKey = createSelector(
	[getFilteredDataGroupedByLayerKey],

	/**
	 * @param groupedRelations {null | Object} Relations grouped by layer key
	 * @return {null | Object} Data sources keys grouped by layer key
	 */
	(groupedRelations) => {
		if (groupedRelations) {
			let groupedDataSourceKeys = {};
			_.forIn(groupedRelations, (relationsData, layerKey) => {
				groupedDataSourceKeys[layerKey] = relationsData;
			});
			return !_.isEmpty(groupedDataSourceKeys) ? groupedDataSourceKeys : null;
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
	[getDataSourceRelationsGroupedByLayerKey],

	/**
	 * @param groupedRelations {null | Object} Relations grouped by layer key
	 * @return {null | Object} Data sources keys grouped by layer key
	 */
	(groupedRelations) => {
		if (groupedRelations) {
			const groupedRelationsDataSource = {};
			for (const [key, value] of Object.entries(groupedRelations)) {
				groupedRelationsDataSource[key] = value.map(r => r ? r.attributeDataSourceKey : null);
			}
			return groupedRelationsDataSource;
		} else {
			return null;
		}
	}
);

export default {
	getAllData,
	getDataSourceKeyFiltered,
	getFiltered,
	getFilteredRelations,
	getFilteredDataGroupedByLayerKey,
	getDataSourceRelationsGroupedByLayerKey,
	getDataSourceKeysGroupedByLayerKey,
	getDataSourcesFromFilteredRelations,

	getSubstate
};