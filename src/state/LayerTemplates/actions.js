import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

const add = common.add(ActionTypes.LAYER_TEMPLATES);
const useKeys = common.useKeys(Select.layerTemplates.getSubstate, 'layerTemplates', ActionTypes.LAYER_TEMPLATES);
const useKeysClear = common.useKeysClear(ActionTypes.LAYER_TEMPLATES);
const useIndexed = common.useIndexed(Select.layerTemplates.getSubstate, 'layerTemplates', ActionTypes.LAYER_TEMPLATES);
const useIndexedClear = common.useIndexedClear(ActionTypes.LAYER_TEMPLATES);

// ============ export ===========

export default {
	add,
	useIndexed,
	useIndexedClear,
	useKeys,
	useKeysClear,
}
