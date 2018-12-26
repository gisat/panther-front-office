import Action from '../Action';
import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

const setActiveKey = common.setActiveKey(ActionTypes.THEMES);
const useIndexed = common.useIndexed(Select.themes.getSubstate, 'themes', ActionTypes.THEMES);
const refreshUses = common.refreshUses(Select.themes.getSubstate, `themes`, ActionTypes.THEMES);

function setActive(key, componentId){
	return (dispatch, getState) => {
		let data = Select.themes.getByKey(getState(), key);
		if (data.data && data.data.topics) {
			// TODO redundant request if attribute sets for these topics were already loaded
			dispatch(Action.attributeSets.loadForTopics(data.data.topics))
				.then(() => {
					let attributeKeys = Select.attributeSets.getUniqueAttributeKeysForTopics(getState(), data.data.topics);
					if (attributeKeys) {
						return dispatch(Action.attributes.useKeys(attributeKeys, componentId));
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
	refreshUses,
	setActive,
	setActiveKey,
	useIndexed,
	useIndexedClear: actionClearUseIndexed
}
