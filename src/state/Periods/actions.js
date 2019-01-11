import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

const setActiveKey = common.setActiveKey(ActionTypes.PERIODS);
const setActiveKeys = common.setActiveKeys(ActionTypes.PERIODS);
const useKeys = common.useKeys(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS);
const useIndexed = common.useIndexed(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS);
const refreshUses = common.refreshUses(Select.periods.getSubstate, `periods`, ActionTypes.PERIODS);
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS);

// ============ actions ===========

function actionClearUseIndexed(componentId) {
	return {
		type: ActionTypes.PERIODS.USE.INDEXED.CLEAR,
		componentId
	}
}

// ============ export ===========

export default {
	ensure: common.ensure.bind(this, Select.periods.getSubstate, 'periods', ActionTypes.PERIODS),
	ensureIndexesWithFilterByActive,
	refreshUses,
	setActiveKey,
	setActiveKeys,
	useIndexed,
	useIndexedClear: actionClearUseIndexed,
	useKeys
}
