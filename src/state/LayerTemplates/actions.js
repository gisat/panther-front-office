import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

const add = common.add(ActionTypes.LAYER_TEMPLATES);
const create = common.create(Select.layerTemplates.getSubstate, 'layerTemplates', ActionTypes.LAYER_TEMPLATES);
const deleteItem = common.delete(Select.layerTemplates.getSubstate, 'layerTemplates', ActionTypes.LAYER_TEMPLATES);
const saveEdited = common.saveEdited(Select.layerTemplates.getSubstate, 'layerTemplates', ActionTypes.LAYER_TEMPLATES);
const updateEdited = common.updateEdited(Select.layerTemplates.getSubstate, ActionTypes.LAYER_TEMPLATES);
const useKeys = common.useKeys(Select.layerTemplates.getSubstate, 'layerTemplates', ActionTypes.LAYER_TEMPLATES);
const useKeysClear = common.useKeysClear(ActionTypes.LAYER_TEMPLATES);
const useIndexed = common.useIndexed(Select.layerTemplates.getSubstate, 'layerTemplates', ActionTypes.LAYER_TEMPLATES);
const useIndexedClear = common.useIndexedClear(ActionTypes.LAYER_TEMPLATES);
const clearIndex = common.clearIndex(ActionTypes.LAYER_TEMPLATES);
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.layerTemplates.getSubstate, 'layerTemplates', ActionTypes.LAYER_TEMPLATES);

// ============ export ===========

export default {
	add,
	clearIndex,
	create,
	delete: deleteItem,
	ensureIndexesWithFilterByActive,

	saveEdited,
	
	setActiveKey: common.setActiveKeyAndEnsureDependencies(ActionTypes.LAYER_TEMPLATES, 'layerTemplate'),

	updateEdited,
	useIndexed,
	useIndexedClear,
	useKeys,
	useKeysClear,
}
