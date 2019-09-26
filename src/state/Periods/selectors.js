import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import _ from 'lodash';

import common from "../_common/selectors";
import attributeRelationsSelectors from "../AttributeRelations/selectors";

const getSubstate = state => state.periods;

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);
const getAllForActiveScope = common.getAllForActiveScope(getSubstate);
const getActive = common.getActive(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getActiveKeys = common.getActiveKeys(getSubstate);
const getActiveModels = common.getActiveModels(getSubstate);

const getByKeys = common.getByKeys(getSubstate);

const getDataByKey = common.getDataByKey(getSubstate);
const getDeletePermissionByKey = common.getDeletePermissionByKey(getSubstate);

const getEditedDataByKey = common.getEditedDataByKey(getSubstate);
const getIndexed = common.getIndexed(getSubstate);
const getUpdatePermissionByKey = common.getUpdatePermissionByKey(getSubstate);

const getKeysByAttributeRelations = createCachedSelector(
	[attributeRelationsSelectors.getFilteredRelations],
	(filteredRelations) => {
		if (filteredRelations) {
			return _.map(filteredRelations, relation => relation.periodKey);
		} else {
			return null;
		}
	}
)((state, filter, cacheKey) => {
	return JSON.stringify(filter) + ':' + JSON.stringify(cacheKey)
});

export default {
	getActiveKey,
	getActiveKeys,
	getActiveModels,
	getAll,
	getAllAsObject,
	getAllForActiveScope,

	getByKeys,

	getDataByKey,
	getDeletePermissionByKey,

	getEditedDataByKey,
	getIndexed,
	getKeysByAttributeRelations,
	getUpdatePermissionByKey,

	getSubstate,

	// TODO handle old selectors export
	getActivePeriod: getActive,
	getPeriods: getAll,
};