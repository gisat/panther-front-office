import ActionTypes from '../../../constants/ActionTypes';
import Select from '../../Select';

import _ from 'lodash';
import utils from '../../../utils/utils'

import common from '../../_common/actions';

const add = common.add(actionAdd);

function update(data) {
	return (dispatch) => {
		if (!_.isArray(data)) data = [data];
		dispatch(actionUpdate(data));
	}
}

function addActiveKeyByColour(colour) {
	return (dispatch, getState) => {
		let selectionForColour = Select.areas.selections.getSelectionByColour(getState(), colour);
		let activeKeys = Select.areas.selections.getActiveKeys(getState());
		if (selectionForColour){
			let keys = activeKeys ? [...activeKeys, selectionForColour.key] : [selectionForColour.key];
			dispatch(actionSetActiveKeys(keys));
		}
	};
}

function removeActiveKeyByColour(colour) {
	return (dispatch, getState) => {
		let selectionForColour = Select.areas.selections.getSelectionByColour(getState(), colour);
		let activeKeys = Select.areas.selections.getActiveKeys(getState());
		if (selectionForColour){
			let newKeys = _.reject(activeKeys, (key) => {return key === selectionForColour.key});
			dispatch(actionSetActiveKeys(newKeys));
		}
	};
}

function setActiveKeys(keys) {
	return (dispatch) => {
		dispatch(actionSetActiveKeys(keys));
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
			dispatch(add(newSelection));
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

function actionSetActiveKeys(keys){
	return {
		type: ActionTypes.AREAS_SELECTIONS_SET_ACTIVE_MULTIPLE,
		keys: keys
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
	addActiveKeyByColour,
	removeActiveKeyByColour,
	setActiveKeys,
	updateSelectionByColour
}
