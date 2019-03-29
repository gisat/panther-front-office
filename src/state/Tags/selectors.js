import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";

const getSubstate = state => state.tags;

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);

const getByKey = common.getByKey(getSubstate);

const getDataByKey = common.getDataByKey(getSubstate);
const getEditedDataByKey = common.getEditedDataByKey(getSubstate);

const getDeletePermissionByKey = common.getDeletePermissionByKey(getSubstate);
const getUpdatePermissionByKey = common.getUpdatePermissionByKey(getSubstate);


export default {
	getAll,
	getAllAsObject,
	getByKey,

	getDataByKey,
	getDeletePermissionByKey,

	getEditedDataByKey,
	getUpdatePermissionByKey,

	getSubstate,
};