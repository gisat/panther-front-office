import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

const create = common.create(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS);
const deleteItem = common.delete(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS);
const saveEdited = common.saveEdited(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS);
const setActiveKey = common.setActiveKey(ActionTypes.PERIODS);
const setActiveKeys = common.setActiveKeys(ActionTypes.PERIODS);
const updateEdited = common.updateEdited(Select.periods.getSubstate, ActionTypes.PERIODS);
const useKeys = common.useKeys(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS);
const useKeysClear = common.useKeysClear(ActionTypes.PERIODS);
const useIndexed = common.useIndexed(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS);
const useIndexedClear = common.useIndexedClear(ActionTypes.PERIODS);
const refreshUses = common.refreshUses(Select.periods.getSubstate, `periods`, ActionTypes.PERIODS);
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS);

// ============ actions ===========

// ============ export ===========

export default {
	create,
	delete: deleteItem,
	ensureIndexesWithFilterByActive,

	refreshUses,

	saveEdited,
	setActiveKey,
	setActiveKeys,

	updateEdited,
	useIndexed,
	useIndexedClear,
	useKeys,
	useKeysClear
}
