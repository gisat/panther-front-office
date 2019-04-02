import ActionTypes from '../../constants/ActionTypes';

import Select from '../Select';
import common from '../../../../state/_common/actions';

// ============ creators ===========

const create = common.create(Select.specific.indicators.getSubstate, 'esponFuoreIndicators', ActionTypes.INDICATORS, 'specific');
const deleteItem = common.delete(Select.specific.indicators.getSubstate, 'esponFuoreIndicators', ActionTypes.INDICATORS, 'specific');
const saveEdited = common.saveEdited(Select.specific.indicators.getSubstate, 'esponFuoreIndicators', ActionTypes.INDICATORS, 'specific');
const updateEdited = common.updateEdited(Select.specific.indicators.getSubstate, ActionTypes.INDICATORS, 'specific');
const useKeys = common.useKeys(Select.specific.indicators.getSubstate, 'esponFuoreIndicators', ActionTypes.INDICATORS, 'specific');
const useKeysClear = common.useKeysClear(ActionTypes.INDICATORS);
const useIndexedClear = common.useIndexedClear(ActionTypes.INDICATORS);
const useIndexed = common.useIndexed(Select.specific.indicators.getSubstate, 'esponFuoreIndicators', ActionTypes.INDICATORS, 'specific');
const refreshUses = common.refreshUses(Select.specific.indicators.getSubstate, `esponFuoreIndicators`, ActionTypes.INDICATORS, 'specific');
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.specific.indicators.getSubstate, 'esponFuoreIndicators', ActionTypes.INDICATORS, 'specific');

// ============ actions ===========

// ============ export ===========

export default {
	create,
	delete: deleteItem,
	ensureIndexesWithFilterByActive,
	saveEdited,
	updateEdited,
	useKeys,
	useKeysClear,
	refreshUses,
	useIndexed,
	useIndexedClear,
}
