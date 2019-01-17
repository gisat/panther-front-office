import Action from '../Action';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import VisualsConfig from '../../constants/VisualsConfig';

import common from '../_common/actions';

// ============ creators ===========

const useIndexed = common.useIndexed(Select.scopes.getSubstate, 'scopes', ActionTypes.SCOPES);
const refreshUses = common.refreshUses(Select.scopes.getSubstate, `scopes`, ActionTypes.SCOPES);
const setActiveKeyAndEnsureDependencies = common.setActiveKeyAndEnsureDependencies(ActionTypes.SCOPES, 'scope');
const setScopeActiveKey = common.setActiveKey(ActionTypes.SCOPES, 'scope');

function setActiveKey(key) {
	return dispatch => {
		dispatch(setActiveKeyAndEnsureDependencies(key));
		dispatch(setScopeActiveKey(key));
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
				//TODO - only if intro mode is active
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
	setActiveKey,
	loadForKeys,
	refreshUses,
	useIndexed
}
