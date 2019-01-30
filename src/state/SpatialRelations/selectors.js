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
		if (relations) {
			if (filter && !_.isEmpty(filter)) {
				return _.filter(relations, filter);
			} else {
				return relations;
			}
		} else {
			return null;
		}
	}
);

/* TODO other keys have to be null */
const getByLayerTemplateKeys = createSelector(
	[getAll,
	(state, layerTemplateKeys) => (layerTemplateKeys)],
	(relations, layerTemplatesKeys) => {
		if (relations && layerTemplatesKeys) {
			if (!_.isArray(layerTemplatesKeys)) layerTemplatesKeys = [layerTemplatesKeys];

			if (layerTemplatesKeys.length) {
				return _.filter(relations, relation => layerTemplatesKeys.includes(relation.data.layerTemplateKey));
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
);

const getDataSourceKeysByLayerTemplateKeys = createSelector(
	[getByLayerTemplateKeys],
	(relations) => {
		if (relations && relations.length) {
			return relations.map(relation => relation.data.dataSourceKey);
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

export default {
	getDataSourceKeysByLayerTemplateKeys,
	getDataSourceKeysFiltered,
	getSubstate
};