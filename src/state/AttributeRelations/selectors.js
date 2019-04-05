import {createSelector} from 'reselect';
import _, {isEmpty} from 'lodash';
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
const getFiltered = createSelector(
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

export default {
	getAllData,
	getDataSourceKeyFiltered,
	getFiltered,

	getSubstate
};