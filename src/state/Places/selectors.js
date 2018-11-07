import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";
import ScopesSelector from "../Scopes/selectors";


const getSubstate = state => state.places;

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);
const getAllForDataview = common.getAllForDataview(getSubstate);
const getAllForDataviewAsObject = common.getAllForDataviewAsObject(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getActive = common.getActive(getSubstate);
const getActivePlaces = common.getActiveModels(getSubstate);

const getPlacesForActiveScope = createSelector(
	[getAll, ScopesSelector.getActiveScopeKey],
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
	getAllForDataview,
	getAllForDataviewAsObject,
	getActiveKey,
	getActive,
	getActivePlaces,
	getPlacesForActiveScope,
	getSubstate
};