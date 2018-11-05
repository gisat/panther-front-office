import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

import common from '../_common/actions';
import LayerPeriods from "../LayerPeriods/actions";
import ScenariosActions from "../Scenarios/actions";
import Select from "../Select";
import Action from "../Action";


// ============ creators ===========

const add = common.add(actionAdd);
const setActiveKey = common.setActiveKey(actionSetActive);
const setActiveKeys = common.setActiveKeys(actionSetActiveKeys);

function setActive(key) {
	return (dispatch, getState) => {
		let state = getState();
		let scopeConfiguration = Select.scopes.getActiveScopeConfiguration(state);
		let activeCaseKey = Select.scenarios.cases.getActiveKey(state);
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

// ============ actions ===========

function actionAdd(places) {
	return {
		type: ActionTypes.PLACES_ADD,
		data: places
	}
}

function actionEnsureError(err) {
	return {
		type: ActionTypes.PLACES.ENSURE.ERROR,
		error: err
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
	add,
	ensure: common.ensure.bind(this, Select.places.getSubstate, 'places', actionAdd, actionEnsureError),
	setActive,
	setActiveKey,
	setActiveKeys
}
