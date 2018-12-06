import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

import common from "../_common/actions";

// ============ creators ===========

const add = common.add(ActionTypes.STYLES);

// ============ export ===========

export default {
	add
}
