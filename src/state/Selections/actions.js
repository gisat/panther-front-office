import Select from '../Select';
import _ from "lodash";
import common from "../_common/actions";
import ActionTypes from "../../constants/ActionTypes";
import utils from "../../utils/utils";

const add = common.add(ActionTypes.SELECTIONS);
const setActiveKey = common.setActiveKey(ActionTypes.SELECTIONS);

function clearActiveSelection() {
	return (dispatch, getState) => {
		let activeKey = Select.selections.getActiveKey(getState());

		if (activeKey) {
			dispatch(setActiveKey(null));
			dispatch(actionRemove([activeKey]));
		}
	};
}

function updateActiveSelection(name, values, areas) {
	return (dispatch, getState) => {
		let active = Select.selections.getActive(getState());
		let data = {name, values, areas};

		if (active) {
			let updated = {...active, data: {...active.data, ...data}};
			dispatch(add(updated));
		} else {
			dispatch(create(data));
		}
	};
}

function create(data){
	return (dispatch) => {
		let selection = {
			key: utils.uuid(),
			data
		};

		dispatch(add([selection]));
		dispatch(setActiveKey(selection.key));
	}
}

function updateStateFromView(data) {
	return dispatch => {
		if (data) {
			dispatch(actionUpdate(data));
		}
	};
}

// ============ actions ===========
function actionRemove(keys){
	return {
		type: ActionTypes.SELECTIONS.REMOVE,
		keys
	}
}

const actionUpdate = (data) => {
	return {
		type: ActionTypes.SELECTIONS.UPDATE_FROM_VIEW,
		data
	}
};

export default {
	clearActiveSelection,
	updateActiveSelection,
	updateStateFromView
}