import common from '../_common/selectors';


const getSubstate = state => state.attributes;

const getAttributes =  common.getAll(getSubstate);
const getActive = common.getActive(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);

const getByKey = common.getByKey(getSubstate);
const getByKeys = common.getByKeys(getSubstate);

const getDataByKey = common.getDataByKey(getSubstate);
const getDeletePermissionByKey = common.getDeletePermissionByKey(getSubstate);

const getEditedDataByKey = common.getEditedDataByKey(getSubstate);
const getUpdatePermissionByKey = common.getUpdatePermissionByKey(getSubstate);

const getStateToSave = common.getStateToSave(getSubstate);

export default {
	getAttributes,

	getActive,
	getActiveKey,

	getAllAsObject,

	getByKey,
	getByKeys,

	getDataByKey,
	getDeletePermissionByKey,

	getEditedDataByKey,
	getUpdatePermissionByKey,

	getStateToSave,
	getSubstate
};