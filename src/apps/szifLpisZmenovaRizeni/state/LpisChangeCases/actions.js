import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import ActionSzifLpisZmenovaRizeni from '../LpisZmenovaRizeni/actions';

import common from '../../../../state/_common/actions';

// ============ creators ===========

const setActiveKey = common.setActiveKey(ActionTypes.LPIS_CHANGE_CASES);
const useIndexedClear = common.useIndexedClear(ActionTypes.LPIS_CHANGE_CASES);
const useIndexedClearAll = common.useIndexedClearAll(ActionTypes.LPIS_CHANGE_CASES);
const useIndexed = common.useIndexed(Select.specific.lpisChangeCases.getSubstate, 'lpisChangeCases', ActionTypes.LPIS_CHANGE_CASES, 'specific');
const saveEdited = common.saveEdited(Select.specific.lpisChangeCases.getSubstate, 'lpisChangeCases', ActionTypes.LPIS_CHANGE_CASES, 'specific');
const updateEdited = common.updateEdited(Select.specific.lpisChangeCases.getSubstate, ActionTypes.LPIS_CHANGE_CASES);
const clearIndex = common.clearIndex(ActionTypes.LPIS_CHANGE_CASES);

// ============ actions ===========

const refreshUses = (filterByActive, filter, order, start, length, componentId) => (dispatch, getState) => {
	const state = getState();
	const indexed = Select.specific.lpisChangeCases.getIndexed(state, filterByActive, filter, order, start, length)
	console.log(indexed);
	
	if(indexed) {
		dispatch(clearIndex(null, order));
	}
	dispatch(useIndexed(null, null, order, 1, 1000, componentId));
	dispatch(ActionSzifLpisZmenovaRizeni.reloadLeftCases());
}
// ============ export ===========

export default {
	setActiveKey,
	useIndexed,
	useIndexedClear,
	useIndexedClearAll,
	refreshUses,
	clearIndex,
	saveEdited,
	updateEdited,
}