import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

const add = common.add(ActionTypes.LAYER_TEMPLATES);
const useKeys = common.useKeys(Select.layerTemplates.getSubstate, 'layerTemplates', ActionTypes.LAYER_TEMPLATES);
const useIndexed = common.useIndexed(Select.layerTemplates.getSubstate, 'layerTemplates', ActionTypes.LAYER_TEMPLATES);



function actionClearUseIndexed(componentId) {
	return {
		type: ActionTypes.LAYER_TEMPLATES.USE.INDEXED.CLEAR,
		componentId
	}
}

// ============ export ===========

export default {
	add,
	useIndexed,
	useKeys,
	useIndexedClear: actionClearUseIndexed,
}
