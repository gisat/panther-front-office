import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import common from '../_common/actions';

// ============ creators ===========

const create = common.create(Select.layersTrees.getSubstate, 'layerTrees', ActionTypes.LAYERSTREES, 'applications');
const deleteItem = common.delete(Select.layersTrees.getSubstate, 'layerTrees', ActionTypes.LAYERSTREES, 'applications');
const saveEdited = common.saveEdited(Select.layersTrees.getSubstate, 'layerTrees', ActionTypes.LAYERSTREES, 'applications');
const updateEdited = common.updateEdited(Select.layersTrees.getSubstate, ActionTypes.LAYERSTREES);
const useKeys = common.useKeys(Select.layersTrees.getSubstate, 'layerTrees', ActionTypes.LAYERSTREES, 'applications');
const useKeysClear = common.useKeysClear(ActionTypes.LAYERSTREES);
const useIndexedClear = common.useIndexedClear(ActionTypes.LAYERSTREES);
const useIndexed = common.useIndexed(Select.layersTrees.getSubstate, 'layerTrees', ActionTypes.LAYERSTREES, 'applications');
const refreshUses = common.refreshUses(Select.layersTrees.getSubstate, 'layerTrees', ActionTypes.LAYERSTREES, 'applications');
const updateStateFromView = common.updateSubstateFromView(ActionTypes.LAYERSTREES);

// ============ actions ===========
function ensureData(filter, componentId) {
	return (dispatch) => {
		return dispatch(useIndexed(null, filter, null, 1, 100, componentId)).then()
	}
}

// ============ export ===========

export default {
	create,
	delete: deleteItem,

	ensureData,

	refreshUses,

	saveEdited,

	updateEdited,
	updateStateFromView,
	useIndexed,
	useIndexedClear,
	useKeys,
	useKeysClear,
}
