import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";
import ScopesSelector from "../Scopes/selectors";


const getSubstate = state => state.places;

const getAll = common.getAll(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getActive = common.getActive(getSubstate);
const getActivePlaces = common.getActiveModels(getSubstate);

const getPlacesForActiveScope = createSelector(
	[getAll, ScopesSelector.getActiveScopeKey],
	(models, activeScopeKey) => {
		return _.filter(models, function(model){
			return model.scope === activeScopeKey;
		});
	}
);

export default {
	getPlaces: getAll,
	getActiveKey,
	getActive,
	getActivePlaces,
	getPlacesForActiveScope
};