import {createSelector} from 'reselect';
import _ from 'lodash';

const getActiveKey = state => state.places.activeKey;
const getPlaces = state => state.places.data;
const getActiveScopeKey = state => state.scopes.activeScopeKey;

const getActive = createSelector(
	[getPlaces, getActiveKey],
	(models, activeKey) => {
		return _.find(models, function(model){
			return model.key === activeKey;
		});
	}
);

const getPlacesForActiveScope = createSelector(
	[getPlaces, getActiveScopeKey],
	(models, activeScopeKey) => {
		return _.filter(models, function(model){
			return model.scope === activeScopeKey;
		});
	}
);

export default {
	getPlaces: getPlaces,
	getActiveKey: getActiveKey,
	getActive: getActive,
	getPlacesForActiveScope: getPlacesForActiveScope
};