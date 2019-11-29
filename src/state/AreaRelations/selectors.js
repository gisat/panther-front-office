import {createSelector} from 'reselect';
import createCachedSelector from "re-reselect";
import _, {isEmpty, cloneDeep} from 'lodash';
import common from "../_common/selectors";

const getSubstate = (state) => state.areaRelations;
const getAll = common.getAll(getSubstate);

/**
 * @return {Array|null}
 */
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
 * @returns {Array|null}
 */
const getFilteredData = createSelector(
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

/**
 * @returns {Object}
 */
const getFilteredDataSourceKeysGroupedByLayerKey = createCachedSelector(
	[
		getAll,
		(state, layers) => layers
	],
	(relations, layers) => {
		if (relations && relations.length) {
			let filteredGroupedByLayerKey = {};

			_.forEach(layers, (layer) => {
				let filteredRelations = _.filter(relations, {'data': layer.filter});
				if (filteredRelations.length) {
					filteredGroupedByLayerKey[layer.key] = filteredRelations.map(relation => relation.data.spatialDataSourceKey);
				}
			});
			return !_.isEmpty(filteredGroupedByLayerKey) ? filteredGroupedByLayerKey : null;

		} else {
			return null;
		}
	}
)(
	(state, layers) => JSON.stringify(layers)
);

export default {
	getSubstate,

	getFilteredData,
	getFilteredDataSourceKeysGroupedByLayerKey
};