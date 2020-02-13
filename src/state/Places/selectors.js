import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";
import ScopesSelectors from "../Scopes/selectors";
import mapUtils from "../../utils/map";


const getSubstate = state => state.places;

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);
const getAllForActiveScope = common.getAllForActiveScope(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getActiveKeys = common.getActiveKeys(getSubstate);
const getActive = common.getActive(getSubstate);
const getActivePlaces = common.getActiveModels(getSubstate);

const getDataByKey = common.getDataByKey(getSubstate);
const getDeletePermissionByKey = common.getDeletePermissionByKey(getSubstate);

const getEditedDataByKey = common.getEditedDataByKey(getSubstate);
const getUpdatePermissionByKey = common.getUpdatePermissionByKey(getSubstate);

// TODO refactor
const getPlacesForActiveScope = createSelector(
	[getAll, ScopesSelectors.getActiveScopeKey],
	(models, activeScopeKey) => {
		return _.filter(models, function(model){
			return model.data && (model.data.dataset === activeScopeKey);
		});
	}
);

const getActiveView = createSelector(
	[
		getActive
	],
	(place) => {
		if (place && place.data && place.data.bbox) {
			return mapUtils.getViewFromBoundingBox(place.data.bbox, true);
		} else {
			return null;
		}
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
	getActiveView,
	
	getByKey: common.getByKey(getSubstate),

	getDataByKey,
	getDeletePermissionByKey,

	getEditedDataByKey,
	getIndexed: common.getIndexed(getSubstate),
	getPlacesForActiveScope,
	getUpdatePermissionByKey,
	getSubstate
};