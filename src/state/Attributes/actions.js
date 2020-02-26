import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========
const create = common.create(Select.attributes.getSubstate, 'attributes', ActionTypes.ATTRIBUTES);
const refreshUses = common.refreshUses(Select.attributes.getSubstate, `attributes`, ActionTypes.ATTRIBUTES);
const deleteItem = common.delete(Select.attributes.getSubstate, 'attributes', ActionTypes.ATTRIBUTES);
const saveEdited = common.saveEdited(Select.attributes.getSubstate, 'attributes', ActionTypes.ATTRIBUTES);
const updateEdited = common.updateEdited(Select.attributes.getSubstate, ActionTypes.ATTRIBUTES);
const useIndexed = common.useIndexed(Select.attributes.getSubstate, 'attributes', ActionTypes.ATTRIBUTES);
const useIndexedClear = common.useIndexedClear(ActionTypes.ATTRIBUTES);
const useKeys = common.useKeys(Select.attributes.getSubstate, 'attributes', ActionTypes.ATTRIBUTES);
const useKeysClear = common.useKeysClear(ActionTypes.ATTRIBUTES);
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.attributes.getSubstate, 'attributes', ActionTypes.ATTRIBUTES);
const updateStateFromView = common.updateSubstateFromView(ActionTypes.ATTRIBUTES);
const useIndexedBatch = common.useIndexedBatch('attributes', ActionTypes.ATTRIBUTES, 'data');

const setActiveKeyAndEnsureDependencies = common.setActiveKeyAndEnsureDependencies(ActionTypes.ATTRIBUTES, 'attribute');

function setActiveKey(key) {
	return dispatch => {
		dispatch(setActiveKeyAndEnsureDependencies(key));
	};
}

function loadAttributeData(filter, componentId) {
	return (dispatch, getState) => {
		return dispatch(useIndexedBatch(null, filter, null, componentId, 'attributeDataSourceKey'));
	}
}

// ============ export ===========

export default {
	create,
	delete: deleteItem,
	ensureIndexesWithFilterByActive,
	updateStateFromView,

	refreshUses,

	saveEdited,
	setActiveKey,

	updateEdited,
	useIndexed,
	useIndexedClear,
	useKeys,
	useKeysClear,
	useIndexedBatch,

	loadAttributeData
}
