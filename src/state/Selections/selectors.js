import common from "../_common/selectors";

const getSubstate = state => state.selections;
const getActive = common.getActive(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);


export default {
	getActiveKey,
	getActive,
	getAllAsObject
}