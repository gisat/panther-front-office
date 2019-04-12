import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";
import ScopesSelectors from "../Scopes/selectors";


const getSubstate = state => state.layersTrees;

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);
const getAllForActiveScope = common.getAllForActiveScope(getSubstate);

const getDataByKey = common.getDataByKey(getSubstate);
const getDeletePermissionByKey = common.getDeletePermissionByKey(getSubstate);

const getEditedDataByKey = common.getEditedDataByKey(getSubstate);
const getUpdatePermissionByKey = common.getUpdatePermissionByKey(getSubstate);


export default {
	getAll,
	getAllAsObject,
	getAllForActiveScope,

	getDataByKey,
	getDeletePermissionByKey,

	getEditedDataByKey,
	getUpdatePermissionByKey,
	getSubstate
};