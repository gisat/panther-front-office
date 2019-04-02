import ActionTypes from '../../constants/ActionTypes';

import Select from '../Select';
import common from '../../../../state/_common/actions';

// ============ creators ===========

const create = common.create(Select.specific.esponFuoreIndicators.getSubstate, 'esponFuoreIndicators', ActionTypes.ESPON_FUORE_INDICATORS, 'specific');
const deleteItem = common.delete(Select.specific.esponFuoreIndicators.getSubstate, 'esponFuoreIndicators', ActionTypes.ESPON_FUORE_INDICATORS, 'specific');
const saveEdited = common.saveEdited(Select.specific.esponFuoreIndicators.getSubstate, 'esponFuoreIndicators', ActionTypes.ESPON_FUORE_INDICATORS, 'specific');
const updateEdited = common.updateEdited(Select.specific.esponFuoreIndicators.getSubstate, ActionTypes.ESPON_FUORE_INDICATORS, 'specific');
const useKeys = common.useKeys(Select.specific.esponFuoreIndicators.getSubstate, 'esponFuoreIndicators', ActionTypes.ESPON_FUORE_INDICATORS, 'specific');
const useKeysClear = common.useKeysClear(ActionTypes.ESPON_FUORE_INDICATORS);
const useIndexedClear = common.useIndexedClear(ActionTypes.ESPON_FUORE_INDICATORS);
const useIndexed = common.useIndexed(Select.specific.esponFuoreIndicators.getSubstate, 'esponFuoreIndicators', ActionTypes.ESPON_FUORE_INDICATORS, 'specific');
const refreshUses = common.refreshUses(Select.specific.esponFuoreIndicators.getSubstate, `esponFuoreIndicators`, ActionTypes.ESPON_FUORE_INDICATORS, 'specific');
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.specific.esponFuoreIndicators.getSubstate, 'esponFuoreIndicators', ActionTypes.ESPON_FUORE_INDICATORS, 'specific');

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
