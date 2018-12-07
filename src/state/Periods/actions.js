import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

const setActiveKey = common.setActiveKey(ActionTypes.PERIODS);
const setActiveKeys = common.setActiveKeys(ActionTypes.PERIODS);
const useIndexed = common.useIndexed(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS);
const refreshAllIndexes = common.refreshAllIndexes(Select.periods.getSubstate, `periods`, ActionTypes.PERIODS);

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
	refreshAllIndexes,
	setActiveKey,
	setActiveKeys,
	useIndexed,
	useIndexedClear: actionClearUseIndexed
}
