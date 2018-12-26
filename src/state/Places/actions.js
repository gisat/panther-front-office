import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

import common from '../_common/actions';
import LayerPeriods from "../LayerPeriods/actions";
import ScenariosActions from "../Scenarios/actions";
import SpatialRelationsActions from "../SpatialRelations/actions";
import SpatialDataSourcesActions from "../SpatialDataSources/actions";
import Select from "../Select";
import Action from "../Action";


// ============ creators ===========

const setActiveKey = common.setActiveKey(ActionTypes.PLACES);
const setActiveKeys = common.setActiveKeys(ActionTypes.PLACES);
const useIndexed = common.useIndexed(Select.places.getSubstate, 'places', ActionTypes.PLACES);
const useKeys = common.useKeys(Select.places.getSubstate, 'places', ActionTypes.PLACES);
const refreshUses = common.refreshUses(Select.places.getSubstate, `places`, ActionTypes.PLACES);
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.places.getSubstate, 'places', ActionTypes.PLACES);

function setActive(keys) {
	return (dispatch, getState) => {
		let state = getState();

		let scope = Select.scopes.getActive(state);
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

		if (_.isArray(keys)){
			dispatch(setActiveKeys(keys));
		} else {
			dispatch(setActiveKey(keys));
		}

		if (scopeConfiguration && !scopeConfiguration.dromasLpisChangeReview) { // loading layerPeriods for case, not place
			dispatch(LayerPeriods.loadForPlace(keys)); // TODO what if keys is array?
		}

		if (scope && scope.data && scope.data.scenarios){
			dispatch(ScenariosActions.loadCases());
			let dispatchRelationsLoading = dispatch(SpatialRelationsActions.load());

			// fix: sometimes dispatchRelationsLoading is undfined and I don't know why
			if (dispatchRelationsLoading){
				dispatchRelationsLoading.then(() => {
					let dataSourcesIds = Select.spatialRelations.getActivePlaceDataSourceIds(getState());
					if (dataSourcesIds && dataSourcesIds.length){
						dispatch(SpatialDataSourcesActions.loadFiltered({'id': dataSourcesIds}));
					}
				});
			}
		}
	};
}

// ============ actions ===========

function actionClearUseIndexed(componentId) {
	return {
		type: ActionTypes.PLACES.USE.INDEXED.CLEAR,
		componentId
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
	ensure: common.ensure.bind(this, Select.places.getSubstate, 'places', ActionTypes.PLACES),
	ensureIndexesWithFilterByActive,
	refreshUses,
	setActive,
	setActiveKey,
	setActiveKeys,
	useIndexed,
	useIndexedClear: actionClearUseIndexed,
	useKeys,

	initializeForExt: actionInitializeForExt
}
