import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

import common from "../_common/actions";
import Select from "../Select";

// ============ creators ===========

const add = common.add(ActionTypes.STYLES);
const useKeys = common.useKeys(Select.styles.getSubstate, 'styles', ActionTypes.STYLES);
const useKeysClear = common.useKeysClear(ActionTypes.STYLES);

// ============ export ===========

export default {
	add,
	useKeys,
	useKeysClear
}
