import {createSelector} from 'reselect';
import _ from 'lodash';
import Select from '../Select';

import common from "../_common/selectors";

const getSubstate = state => state.scopes;

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);

const getActive = common.getActive(getSubstate);
const getByKey = common.getByKey(getSubstate);

const getDataByKey = common.getDataByKey(getSubstate);
const getEditedDataByKey = common.getEditedDataByKey(getSubstate);

const getDeletePermissionByKey = common.getDeletePermissionByKey(getSubstate);
const getUpdatePermissionByKey = common.getUpdatePermissionByKey(getSubstate);


const getActiveScopeConfiguration = createSelector(
	[getActive],
	(scope) => {
		return scope && scope.data && scope.data.configuration ? scope.data.configuration : null;
	}
);

const getScopesForActiveUser = createSelector([
	getAll,
	],(scopes) => {
		return scopes;
	}
);


export default {
	getActiveScopeConfiguration,
	getActiveScopeData: getActive,
	getActiveScopeKey: getActiveKey,
	getDataByKey,
	getEditedDataByKey,
	getScopes: getAll,
	getScopesForActiveUser,
	getScopeData: getByKey,

	getActiveKey,
	getAll,
	getAllAsObject,
	getActive,

	getDeletePermissionByKey,
	getUpdatePermissionByKey,

	getSubstate,
};