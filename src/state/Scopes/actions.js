import Action from '../Action';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import VisualsConfig from '../../constants/VisualsConfig';

import common from '../_common/actions';

// ============ creators ===========

const create = common.create(Select.scopes.getSubstate, 'scopes', ActionTypes.SCOPES);
const deleteItem = common.delete(Select.scopes.getSubstate, 'scopes', ActionTypes.SCOPES);
const saveEdited = common.saveEdited(Select.scopes.getSubstate, 'scopes', ActionTypes.SCOPES);
const updateEdited = common.updateEdited(Select.scopes.getSubstate, ActionTypes.SCOPES);
const useKeys = common.useKeys(Select.scopes.getSubstate, 'scopes', ActionTypes.SCOPES);
const useKeysClear = common.useKeysClear(ActionTypes.SCOPES);
const useIndexedClear = common.useIndexedClear(ActionTypes.SCOPES);
const useIndexed = common.useIndexed(Select.scopes.getSubstate, 'scopes', ActionTypes.SCOPES);
const refreshUses = common.refreshUses(Select.scopes.getSubstate, `scopes`, ActionTypes.SCOPES);
const setActiveKeyAndEnsureDependencies = common.setActiveKeyAndEnsureDependencies(ActionTypes.SCOPES, 'scope');
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.scopes.getSubstate, 'scopes', ActionTypes.SCOPES);
const updateStateFromView = common.updateSubstateFromView(ActionTypes.SCOPES);

function setActiveKey(key) {
	return dispatch => {
		dispatch(setActiveKeyAndEnsureDependencies(key));
	};
}

// ============ actions ===========


// ============ export ===========

export default {
	create,
	delete: deleteItem,
	ensureIndexesWithFilterByActive,

	refreshUses,

	saveEdited,
	setActiveKey,

	updateEdited,
	updateStateFromView,
	useIndexed,
	useIndexedClear,
	useKeys,
	useKeysClear,
}
