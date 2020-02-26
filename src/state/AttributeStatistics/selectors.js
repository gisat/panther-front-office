import common from "../_common/selectors";

const getSubstate = (state) => state.attributeStatistics;
const getAllAsObject = common.getAllAsObject(getSubstate);
const getByKey = common.getByKey(getSubstate);
const getBatchByFilterOrder = common.getBatchByFilterOrder(getSubstate);

export default {
	getByKey,
	getSubstate,
	getAllAsObject,
	getBatchByFilterOrder,
};