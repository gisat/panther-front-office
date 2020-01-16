import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import common from '../../../../state/_common/actions';

// ============ creators ===========

const setActiveKey = common.setActiveKey(ActionTypes.LPIS_CHANGE_CASES);
const useIndexedClear = common.useIndexedClear(ActionTypes.LPIS_CHANGE_CASES);
const useIndexed = common.useIndexed(Select.specific.lpisChangeCases.getSubstate, 'lpisChangeCases', ActionTypes.LPIS_CHANGE_CASES, 'specific');
const saveEdited = common.saveEdited(Select.specific.lpisChangeCases.getSubstate, 'lpisChangeCases', ActionTypes.LPIS_CHANGE_CASES, 'specific');
const updateEdited = common.updateEdited(Select.specific.lpisChangeCases.getSubstate, ActionTypes.LPIS_CHANGE_CASES);
const clearIndex = common.clearIndex(ActionTypes.LPIS_CHANGE_CASES);

// ============ actions ===========

// ============ export ===========

export default {
	setActiveKey,
	useIndexed,
	useIndexedClear,
	clearIndex,
	saveEdited,
	updateEdited,
}