import ActionTypes from '../../../constants/ActionTypes';
import Select from '../../Select';

import _ from 'lodash';
import utils from '../../../utils/utils'

import common from '../../_common/actions';

function update(data) {
	return (dispatch) => {
		if (!_.isArray(data)) data = [data];
		dispatch(actionUpdate(data));
	}
}

function updateSelectionByColour(colour, attributeFilter) {
	return (dispatch, getState) => {
		let selectionForColour = Select.areas.selections.getSelectionByColour(getState(), colour);
		if (selectionForColour){
			let updatedSelection = {
				...selectionForColour, data: {
					...selectionForColour.data, selection: {
						...selectionForColour.data.selection, attributeFilter: attributeFilter
					}
				}
			};
			dispatch(update(updatedSelection));
		} else {
			let newSelection = {
				key: utils.guid(),
				data: {
					colour: colour,
					selection: {
						attributeFilter: attributeFilter
					}
				}
			};
			dispatch(common.add(actionAdd)(newSelection));
		}
	};
}


// ============ actions ===========
function actionAdd(selections){
	return {
		type: ActionTypes.AREAS_SELECTIONS_ADD,
		data: selections
	}
}

function actionUpdate(selections){
	return {
		type: ActionTypes.AREAS_SELECTIONS_UPDATE,
		data: selections
	}
}


// ============ export ===========

export default {
	updateSelectionByColour: updateSelectionByColour
}
