import {createSelector} from 'reselect';
import _ from 'lodash';
import common from '../_common/selectors';


const getSubstate = state => state.attributes;

const getAllForActiveApp = common.getAllForActiveApp(getSubstate);
const getAttributes =  common.getAll(getSubstate);

const getDataByKey = common.getDataByKey(getSubstate);
const getDeletePermissionByKey = common.getDeletePermissionByKey(getSubstate);

const getEditedDataByKey = common.getEditedDataByKey(getSubstate);
const getUpdatePermissionByKey = common.getUpdatePermissionByKey(getSubstate);

export default {
	getAllForActiveApp,
	getAttributes,

	getDataByKey,
	getDeletePermissionByKey,

	getEditedDataByKey,
	getUpdatePermissionByKey,
	getSubstate
};