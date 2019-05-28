import Action from '../Action';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import VisualsConfig from '../../constants/VisualsConfig';

import common from '../_common/actions';
import attributeRelationsActions from '../AttributeRelations/actions';

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
	return (dispatch, getState) => {
		dispatch(setActiveKeyAndEnsureDependencies(key));

		// TODO move somewhere else (probably after implementing areas)
		let activeScope = Select.scopes.getActive(getState());
		if (activeScope && activeScope.data && activeScope.data.configuration && activeScope.data.configuration.areaNameAttributeKey) {
			dispatch(attributeRelationsActions.ensureIndexedSpecific({scopeKey: key, attributeKey: activeScope.data.configuration.areaNameAttributeKey}, null, 1, 10, 'scopes.actions#setActiveScope', true));
		}
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
