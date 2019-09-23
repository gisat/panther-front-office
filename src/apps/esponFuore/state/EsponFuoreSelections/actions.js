import _ from 'lodash';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import common from '../../../../state/_common/actions';
import utils from "../../../../utils/utils";

const add = common.add(ActionTypes.ESPON_FUORE_SELECTIONS);
const setActiveKey = common.setActiveKey(ActionTypes.ESPON_FUORE_SELECTIONS);

function clearActiveSelection() {
	return (dispatch, getState) => {
		let activeKey = Select.specific.esponFuoreSelections.getActiveKey(getState());

		if (activeKey) {
			dispatch(setActiveKey(null));
			dispatch(actionRemove([activeKey]));
		}
	};
}

function clearActiveAttributeFilterAndByAttributeKey(attributeKey) {
	return (dispatch) => {
		dispatch(updateActiveSelectionAttributeFilterAndByAttributeKey(attributeKey));
	}
}

function updateActiveSelectionAttributeFilterAndByAttributeKey(attributeKey, filter){
	return ((dispatch, getState) => {
		let activeSelection = Select.specific.esponFuoreSelections.getActive(getState());
		if (activeSelection) {
			// remove obsolete filter part and push updated
			let updatedAttributeFilterAnd = _.reject([...activeSelection.data.attributeFilter.and], {attributeKey});

			if (filter) {
				updatedAttributeFilterAnd.push(filter);
			}

			if (updatedAttributeFilterAnd.length) {
				let updatedSelection = {
					...activeSelection,
					data: {
						...activeSelection.data,
						attributeFilter: {
							...activeSelection.data.attributeFilter,
							and: updatedAttributeFilterAnd
						}
					}
				};

				// TODO update instead of add?
				dispatch(add([updatedSelection]));
			} else {

				// TODO currently omitting other filters
				dispatch(setActiveKey(null));
				dispatch(actionRemove([activeSelection.key]));
			}
		} else {
			let data = {
				attributeFilter: {
					and: [filter]
				}
			};
			dispatch(createActiveSelection(data));
		}
	});
}

function createActiveSelection(data) {
	return (dispatch => {
		let selection = {
			key: utils.uuid(),
			data
		};

		dispatch(add([selection]));
		dispatch(setActiveKey(selection.key));
	});
}

// ============ actions ===========
function actionRemove(keys){
	return {
		type: ActionTypes.ESPON_FUORE_SELECTIONS.REMOVE,
		keys
	}
}

export default {
	clearActiveSelection,
	clearActiveAttributeFilterAndByAttributeKey,
	updateActiveSelectionAttributeFilterAndByAttributeKey
}