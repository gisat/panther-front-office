import common from "../_common/actions";
import ActionTypes from "../../constants/ActionTypes";
import Select from "../Select";

const add = common.add(ActionTypes.SELECTIONS);
const setActiveKey = common.setActiveKey(ActionTypes.SELECTIONS);

const setActiveSelectionFeatureKeysFilterKeys = (selectionKeys) => {
	return (dispatch, getState) => {
		let activeSelectionKey = Select.selections.getActiveKey(getState());
		if (activeSelectionKey && selectionKeys) {
			dispatch(setFeatureKeysFilterKeys(activeSelectionKey, selectionKeys));
		}
	}
};

// ============ actions ===========
function setFeatureKeysFilterKeys(key, featureKeys){
	return {
		type: ActionTypes.SELECTIONS.SET.FEATURE_KEYS_FILTER.KEYS,
		key,
		featureKeys
	}
}

export default {
	add,
	setActiveSelectionFeatureKeysFilterKeys,
	setActiveKey
}