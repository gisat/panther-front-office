import {createSelector} from 'reselect';

import {commonSelectors as common} from '@gisatcz/ptr-state';
import {getAllForActiveApp as gafaa} from '../_backOffice/selectors';

const getSubstate = state => state.specific.configurations;

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);
const getActive = common.getActive(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getActiveKeys = common.getActiveKeys(getSubstate);
const getActiveModels = common.getActiveModels(getSubstate);

const getDataByKey = common.getDataByKey(getSubstate);
const getDeletePermissionByKey = common.getDeletePermissionByKey(getSubstate);

const getEditedDataByKey = common.getEditedDataByKey(getSubstate);
const getUpdatePermissionByKey = common.getUpdatePermissionByKey(getSubstate);

const getIndexes = common.getIndexes(getSubstate);

const getAllForActiveApp = gafaa(getSubstate);


export default {
	getActive,
	getActiveKey,
	getActiveKeys,
	getActiveModels,
	getAllAsObject,
	getDataByKey,
	getDeletePermissionByKey,
	getEditedDataByKey,
	getUpdatePermissionByKey,
	getSubstate,
	getAllForActiveApp
};