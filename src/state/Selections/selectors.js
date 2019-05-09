import common from "../_common/selectors";

const getSubstate = state => state.selections;
const getActive = common.getActive(getSubstate);

export default {
	getActive,

	getSubstate
};