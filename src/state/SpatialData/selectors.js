import common from "../_common/selectors";

const getSubstate = (state) => state.spatialData;

const getAllAsObject = common.getAllAsObject(getSubstate);
const getByKey = common.getByKey(getSubstate);

export default {
	getAllAsObject,
	getByKey,
	getSubstate,
};