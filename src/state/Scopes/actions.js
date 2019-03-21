import Action from '../Action';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import VisualsConfig from '../../constants/VisualsConfig';

import common from '../_common/actions';

// ============ creators ===========

const create = common.create(Select.scopes.getSubstate, 'scopes', ActionTypes.SCOPES);
const deleteItem = common.delete(Select.scopes.getSubstate, 'scopes', ActionTypes.SCOPES);
const saveEdited = common.saveEdited(Select.scopes.getSubstate, 'scopes', ActionTypes.SCOPES);
const updateEdited = common.updateEdited(Select.scopes.getSubstate, ActionTypes.SCOPES);
const useKeys = common.useKeys(Select.scopes.getSubstate, 'scopes', ActionTypes.SCOPES);
const useKeysClear = common.useKeysClear(ActionTypes.SCOPES);
const useIndexedClear = common.useIndexedClear(ActionTypes.SCOPES);
const useIndexed = common.useIndexed(Select.scopes.getSubstate, 'scopes', ActionTypes.SCOPES);
const refreshUses = common.refreshUses(Select.scopes.getSubstate, `scopes`, ActionTypes.SCOPES);
const setActiveKeyAndEnsureDependencies = common.setActiveKeyAndEnsureDependencies(ActionTypes.SCOPES, 'scope');
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.scopes.getSubstate, 'scopes', ActionTypes.SCOPES);

function setActiveKey(key) {
	return dispatch => {
		dispatch(setActiveKeyAndEnsureDependencies(key));
		dispatch(applyScopeConfiguration());
	};
}

function applyScopeConfiguration() {
	return (dispatch, getState) => {
		let scopeConfig = Select.scopes.getActiveScopeConfiguration(getState());
		let htmlClass = null;
		let activeKey = null;

		if (scopeConfig){
			if (scopeConfig.hasOwnProperty(`dromasLpisChangeReview`)) {
				dispatch(Action.specific.lpisChangeReviewCases.load());
			}

			if (scopeConfig.hasOwnProperty('lpisCheckReview')) {
				dispatch(Action.specific.lpisCheckCases.load());
			}
			if (scopeConfig.style){
				let styleToUse = VisualsConfig[scopeConfig.style];
				htmlClass = styleToUse && styleToUse.htmlClass ? styleToUse.htmlClass : null;
				activeKey = scopeConfig.style;
			}
		}
		dispatch(Action.components.setApplicationStyleActiveKey(activeKey));
		dispatch(Action.components.setApplicationStyleHtmlClass('forScope', htmlClass));
	}
}

function loadAll() {
	return dispatch => {
		dispatch(common.loadAll('scopes', ActionTypes.SCOPES));
		dispatch(actionLoadRequest());
	}
}

function loadForKeys(keys){
	return (dispatch) => {
		let filter = {
			key: {
				in: keys
			}
		};
		return dispatch(common.loadFiltered('scopes', ActionTypes.SCOPES, filter));
	}
}

// ============ actions ===========

function actionLoadRequest() {
	return {
		type: ActionTypes.SCOPES.LOAD.REQUEST,
	}
}

function actionSetActiveKey(key) {
	return {
		type: ActionTypes.SCOPES.SET_ACTIVE_KEY,
		key: key
	}
}

// ============ export ===========

export default {
	create,
	delete: deleteItem,
	ensureIndexesWithFilterByActive,
	saveEdited,
	updateEdited,
	useKeys,
	useKeysClear,
	setActiveKey,
	loadForKeys,
	refreshUses,
	useIndexed,
	useIndexedClear,
}
