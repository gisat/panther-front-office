import ActionTypes from '../../constants/ActionTypes';

import _ from 'lodash';
import LayerPeriods from "../LayerPeriods/actions";
import ScenariosActions from "../Scenarios/actions";
import Select from "../Select";
import Action from "../Action";


// ============ creators ===========

function add(places) {
	return dispatch => {
		if (!_.isArray(places)) places = [places];
		dispatch(actionAdd(places));
	};
}

function setActive(key) {
	return (dispatch, getState) => {
		let state = getState();
		let scopeConfiguration = Select.scopes.getActiveScopeConfiguration(state);
		let activeCaseKey = Select.scenarios.getActiveCaseKey(state);
		let activeChoroplethsKeys = Select.choropleths.getActiveKeys(state);

		if (activeCaseKey){
			dispatch(ScenariosActions.setActiveCase(null));
			dispatch(Action.components.windows.scenarios.setActiveScreen('caseList'));
		}

		if (activeChoroplethsKeys){
			dispatch(Action.choropleths.removeAllActiveKeys());
		}

		dispatch(actionSetActive(key));
		if (scopeConfiguration && !scopeConfiguration.dromasLpisChangeReview) { // loading layerPeriods for case, not place
			dispatch(LayerPeriods.loadForPlace(key));
		}
	};
}

function setActiveKeys(places) {
	return dispatch => {
		if (!_.isArray(places)) places = [places];
		dispatch(actionSetActiveKeys(places));
	};
}

// ============ actions ===========

function actionAdd(places) {
	return {
		type: ActionTypes.PLACES_ADD,
		data: places
	}
}

function actionSetActive(key) {
	return {
		type: ActionTypes.PLACES_SET_ACTIVE,
		key: key
	}
}

function actionSetActiveKeys(places) {
	return {
		type: ActionTypes.PLACES_SET_ACTIVE_MULTI,
		keys: places
	}
}

// ============ export ===========

export default {
	add: add,
	setActive: setActive,
	setActiveKeys: setActiveKeys
}
