import common from "../_common/selectors";

const getSubstate = state => state._deprecatedSelections;
const getActive = common.getActive(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);

export default {
	getActive,
	getActiveKey,

	getSubstate
};