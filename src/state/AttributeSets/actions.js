import ActionTypes from '../../constants/ActionTypes';

import common from "../_common/actions";


// ============ creators ===========

const setActiveKeys = common.setActiveKeys(ActionTypes.ATTRIBUTE_SETS);

// ============ export ===========

export default {
	setActiveKeys
}
