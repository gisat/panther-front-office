import Select from '../Select';
import _ from "lodash";
import common from "../_common/actions";
import ActionTypes from "../../constants/ActionTypes";
import utils from "../../utils/utils";

const add = common.add(ActionTypes.SELECTIONS);
const setActiveKey = common.setActiveKey(ActionTypes.SELECTIONS);

function updateActiveSelection(keys) {
	return (dispatch, getState) => {
		let active = Select.selections.getActive(getState());
		if (active) {
			let updated = {...active, data: {...active.data, areas: keys}};
			dispatch(add(updated));
		} else {
			dispatch(create(keys));
		}
	};
}

function create(keys){
	return (dispatch) => {
		let selection = {
			key: utils.uuid(),
			data: {
				areas: keys
			}
		};

		dispatch(add([selection]));
		dispatch(setActiveKey(selection.key));
	}
}

export default {
	updateActiveSelection
}