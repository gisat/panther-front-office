import common from "../_common/selectors";

const getSubstate = state => state.cases;

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


export default {
	getActive,
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
	getUpdatePermissionByKey,

	getSubstate,
};