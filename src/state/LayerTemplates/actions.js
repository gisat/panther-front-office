import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

const add = common.add(ActionTypes.LAYER_TEMPLATES);
const useKeys = common.useKeys(Select.layerTemplates.getSubstate, 'layertemplates', ActionTypes.LAYER_TEMPLATES);

// ============ export ===========

export default {
	add,
	useKeys
}
