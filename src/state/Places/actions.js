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
const useIndexed = common.useIndexed(Select.places.getSubstate, 'places', actionAdd, actionAddIndex, ensureForScopeError, actionRegisterUseIndexed);

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

function ensureForScopeError(data) {
	return dispatch => {
		throw new Error(`state/dataviews/actions#ensureForScopeError: ${data}`);
	}
}

// ============ actions ===========

function actionAdd(places) {
	return {
		type: ActionTypes.PLACES_ADD,
		data: places
	}
}

function actionAddIndex(filter, order, count, start, data) {
	return {
		type: ActionTypes.PLACES.INDEX.ADD,
		filter: filter,
		order: order,
		count: count,
		start: start,
		data: data
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

function actionRegisterUseIndexed(componentId, filter, order, start, length) {
	return {
		type: ActionTypes.PLACES.USE.INDEXED.REGISTER,
		componentId,
		filter,
		order,
		start,
		length
	}
}

// TODO It will be removed along with Ext
function actionInitializeForExt() {
	return {
		type: ActionTypes.PLACES.INITIALIZE_FOR_EXT,
	}
}

// ============ export ===========

export default {
	add,
	ensure: common.ensure.bind(this, Select.places.getSubstate, 'places', actionAdd, actionEnsureError),
	setActive,
	setActiveKey,
	setActiveKeys,
	useIndexed,

	initializeForExt: actionInitializeForExt
}
