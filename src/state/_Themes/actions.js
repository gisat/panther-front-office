import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/actions';
import Select from "../Select";
import AttributeSetsActions from "../AttributeSets/actions";
import AttributesActions from "../Attributes/actions";

// ============ creators ===========

const setActiveKey = common.setActiveKey(ActionTypes.THEMES);
const useIndexed = common.useIndexed(Select.themes.getSubstate, 'themes', ActionTypes.THEMES);
const refreshAllIndexes = common.refreshAllIndexes(Select.themes.getSubstate, `themes`, ActionTypes.THEMES);

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
		return dispatch(common.loadFiltered('themes', ActionTypes.THEMES, filter));
	}
}

// ============ actions ===========

function actionClearUseIndexed(componentId) {
	return {
		type: ActionTypes.THEMES.USE.INDEXED.CLEAR,
		componentId
	}
}

// ============ export ===========

export default {
	loadByKeys,
	refreshAllIndexes,
	setActive,
	setActiveKey,
	useIndexed,
	useIndexedClear: actionClearUseIndexed
}
