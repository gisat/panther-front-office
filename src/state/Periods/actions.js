import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

const add = common.add(ActionTypes.PERIODS);
const create = common.create(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS);
const deleteItem = common.delete(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS);
const saveEdited = common.saveEdited(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS);
const updateEdited = common.updateEdited(Select.periods.getSubstate, ActionTypes.PERIODS);
const updateStateFromView = common.updateSubstateFromView(ActionTypes.PERIODS);
const useKeys = common.useKeys(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS);
const useKeysClear = common.useKeysClear(ActionTypes.PERIODS);
const useIndexed = common.useIndexed(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS);
const useIndexedClear = common.useIndexedClear(ActionTypes.PERIODS);
const refreshUses = common.refreshUses(Select.periods.getSubstate, `periods`, ActionTypes.PERIODS);
const setActiveKeyAndEnsureDependencies = common.setActiveKeyAndEnsureDependencies(ActionTypes.PERIODS, 'period');
const setActiveKeysAndEnsureDependencies = common.setActiveKeysAndEnsureDependencies(ActionTypes.PERIODS, 'period');
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS);

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
