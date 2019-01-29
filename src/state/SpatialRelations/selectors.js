import {createSelector} from 'reselect';
import _ from 'lodash';
import common from "../_common/selectors";

const getSubstate = (state) => state.spatialRelations;
const getAll = common.getAll(getSubstate);

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

export default {
	getDataSourceKeysByLayerTemplateKeys,
	getSubstate
};