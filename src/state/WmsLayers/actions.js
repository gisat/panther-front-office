import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';
import common from "../_common/actions";



// ============ creators ===========

const add = common.add(ActionTypes.WMS_LAYERS);

// ============ export ===========

export default {
	add,
}
