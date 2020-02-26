import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

const add = common.add(ActionTypes.CASES);
const create = common.create(Select.cases.getSubstate, 'cases', ActionTypes.CASES);
const deleteItem = common.delete(Select.cases.getSubstate, 'cases', ActionTypes.CASES);
const saveEdited = common.saveEdited(Select.cases.getSubstate, 'cases', ActionTypes.CASES);
const updateEdited = common.updateEdited(Select.cases.getSubstate, ActionTypes.CASES);
const updateStateFromView = common.updateSubstateFromView(ActionTypes.CASES);
const useKeys = common.useKeys(Select.cases.getSubstate, 'cases', ActionTypes.CASES);
const useKeysClear = common.useKeysClear(ActionTypes.CASES);
const useIndexed = common.useIndexed(Select.cases.getSubstate, 'cases', ActionTypes.CASES);
const useIndexedClear = common.useIndexedClear(ActionTypes.CASES);
const refreshUses = common.refreshUses(Select.cases.getSubstate, `cases`, ActionTypes.CASES);
const setActiveKeyAndEnsureDependencies = common.setActiveKeyAndEnsureDependencies(ActionTypes.CASES, 'case');
const setActiveKeysAndEnsureDependencies = common.setActiveKeysAndEnsureDependencies(ActionTypes.CASES, 'case');
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.cases.getSubstate, 'cases', ActionTypes.CASES);

function setActiveKey(key) {
	return dispatch => {
		dispatch(setActiveKeyAndEnsureDependencies(key));
	};
}

function setActiveKeys(keys) {
	return dispatch => {
		dispatch(setActiveKeysAndEnsureDependencies(keys));
	};
}

// ============ actions ===========

// ============ export ===========

export default {
	add,
	create,
	delete: deleteItem,
	ensureIndexesWithFilterByActive,

	refreshUses,

	saveEdited,
	setActiveKey,
	setActiveKeys,

	updateEdited,
	updateStateFromView,
	useIndexed,
	useIndexedClear,
	useKeys,
	useKeysClear
}
