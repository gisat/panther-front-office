import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";
import ScopesSelectors from "../Scopes/selectors";


const getSubstate = state => state.places;

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);
const getAllForActiveScope = common.getAllForActiveScope(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getActiveKeys = common.getActiveKeys(getSubstate);
const getActive = common.getActive(getSubstate);
const getActivePlaces = common.getActiveModels(getSubstate);

const getPlacesForActiveScope = createSelector(
	[getAll, ScopesSelectors.getActiveScopeKey],
	(models, activeScopeKey) => {
		return _.filter(models, function(model){
			return model.data && (model.data.dataset === activeScopeKey);
		});
	}
);

export default {
	getPlaces: getAll,
	getAll,
	getAllAsObject,
	getAllForActiveScope,
	getActiveKey,
	getActiveKeys,
	getActive,
	getActivePlaces,
	getPlacesForActiveScope,
	getSubstate
};