import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";
import AttributeRelations from "../AttributeRelations/selectors";

const getSubstate = (state) => state.attributeDataSources;
const getAllAsObject = common.getAllAsObject(getSubstate);

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

export default {
	getSubstate,
	getFiltered,
};