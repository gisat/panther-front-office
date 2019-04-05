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
	[getFilteredData],
	(filteredRelations) => {
		return filteredRelations.dataSourceKey;
		// if (filteredRelations && filteredRelations.length) {
		// 	return _.find(filteredRelations, relation => relation.dataSourceKey);
		// } else {
		// 	return null;
		// }
	}
);

export default {
	getAllData,
	getDataSourceKeyFiltered,
	getFilteredData,

	getSubstate
};