import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";

const getSubstate = state => state.views;

const getActiveKey = common.getActiveKey(getSubstate);
const getActiveKeys = common.getActiveKeys(getSubstate);

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);
const getAllForActiveApp = common.getAllForActiveApp(getSubstate);

const getByKey = common.getByKey(getSubstate);

const getDataByKey = common.getDataByKey(getSubstate);
const getEditedDataByKey = common.getEditedDataByKey(getSubstate);

const getDeletePermissionByKey = common.getDeletePermissionByKey(getSubstate);
const getUpdatePermissionByKey = common.getUpdatePermissionByKey(getSubstate);


export default {
	getActiveKey,
	getActiveKeys,
	getAllForActiveApp,
	getDataByKey,
	getEditedDataByKey,
	getScopes: getAll,
	getViewsData: getByKey,

	getAll,
	getAllAsObject,

	getDeletePermissionByKey,
	getUpdatePermissionByKey,

	getSubstate,
};