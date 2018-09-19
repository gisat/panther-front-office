import ActionTypes from '../../../constants/ActionTypes';
import Select from '../../Select';

import _ from 'lodash';
import utils from '../../../utils/utils'

import common from '../../_common/actions';

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
			// TODO what about this construct?
			dispatch(common.update(actionUpdate)(updatedSelection));
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
			// TODO what about this construct?
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
