import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/actions';
import Select from "../Select";
import AttributeSetsActions from "../AttributeSets/actions";
import AttributesActions from "../Attributes/actions";

// ============ creators ===========

const add = common.add(ActionTypes.THEMES);
const setActiveKey = common.setActiveKey(ActionTypes.THEMES);
const useIndexed = common.useIndexed(Select.themes.getSubstate, 'themes', add, actionAddIndex, ensureForScopeError, actionRegisterUseIndexed);
const refreshAllIndexes = common.refreshAllIndexes(Select.themes.getSubstate, `themes`, add, actionAddIndex, actionClearIndexes, () => {});

function setActive(key){
	return (dispatch, getState) => {
		let data = Select.themes.getByKey(getState(), key);
		if (data.data && data.data.topics) {
			// TODO redundant request if attribute sets for these topics were already loaded
			dispatch(AttributeSetsActions.loadForTopics(data.data.topics))
				.then(() => {
					let attributeKeys = Select.attributeSets.getAttributeKeysForActive(getState());
					if (attributeKeys) {
						return dispatch(AttributesActions.ensure(attributeKeys));
					} else {
						throw new Error(`state/_Themes/actions#setActive No attributes for active attribute sets!`);
					}
				})
				.then(() => {
					dispatch(setActiveKey(key));
				})
				.catch((err) => {
					throw new Error(err);
				});
		}
	}
}

function loadByKeys(keys){
	return dispatch => {
		let filter = {
			key: {
				in: keys
			}
		};
		return dispatch(common.loadFiltered('themes', filter, add, actionLoadError));
	}
}

function ensureForScopeError(data) {
	return dispatch => {
		throw new Error(`state/themes/actions#ensureForScopeError: ${data}`);
	}
}

// ============ actions ===========

function actionAddIndex(filter, order, count, start, data) {
	return {
		type: ActionTypes.THEMES.INDEX.ADD,
		filter: filter,
		order: order,
		count: count,
		start: start,
		data: data
	}
}

function actionClearIndexes() {
	return {
		type: ActionTypes.THEMES.INDEX.CLEAR_ALL,
	}
}

function actionClearUseIndexed(componentId) {
	return {
		type: ActionTypes.THEMES.USE.INDEXED.CLEAR,
		componentId
	}
}

function actionRegisterUseIndexed(componentId, filterByActive, filter, order, start, length) {
	return {
		type: ActionTypes.THEMES.USE.INDEXED.REGISTER,
		componentId,
		filterByActive,
		filter,
		order,
		start,
		length
	}
}

function actionLoadError(error) {
	return {
		type: ActionTypes.THEMES.LOAD.ERROR,
		error: error
	}
}

function actionSetActiveKey(key) {
	return {
		type: ActionTypes.THEMES.SET_ACTIVE_KEY,
		key: key
	}
}

// ============ export ===========

export default {
	add,
	loadByKeys,
	refreshAllIndexes,
	setActive,
	setActiveKey,
	useIndexed,
	useIndexedClear: actionClearUseIndexed
}
