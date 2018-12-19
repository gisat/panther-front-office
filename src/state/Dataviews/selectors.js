import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import _ from 'lodash';
import common from "../_common/selectors";

import AttributesSelectors from '../Attributes/selectors';
import AttributeSetsSelectors from '../AttributeSets/selectors';
import PeriodsSelectors from '../Periods/selectors';
import PlacesSelectors from '../Places/selectors';
import ScopesSelectors from '../Scopes/selectors';
import ThemesSelectors from '../_Themes/selectors';
import UsersSelectors from '../Users/selectors';
import VisualsConfig from "../../constants/VisualsConfig";

const getSubstate = state => state.dataviews;

const getAll = common.getAll(getSubstate);
const getAllForActiveScope = common.getAllForActiveScope(getSubstate);
const getActive = common.getActive(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getByKey = common.getByKey(getSubstate);


const getViewsForScope = createSelector(
	getAll,
	(state, scope) => scope,
	(views, scope) => {
		if (!scope) {
			return null;
		} else {
			return _.filter(views, (view) => {
				return (view.data && view.data.dataset) === scope.key
			});
		}
	}
);

const getDataForInitialLoad = createSelector(
	[getActive,
		AttributesSelectors.getAllForDataview,
		AttributesSelectors.isInitializedForExt,
		AttributeSetsSelectors.getAllForDataview,
		AttributeSetsSelectors.isInitializedForExt,
		PeriodsSelectors.getAllForDataview,
		PlacesSelectors.getAllForDataview,
		PlacesSelectors.isInitializedForExt,
		PlacesSelectors.getActiveKey,
		ScopesSelectors.getAllForDataview,
		ScopesSelectors.getActiveScopeConfiguration,
		ThemesSelectors.getAllForDataview],
	(dataview, attributes, attributesInitialized, attributeSets, attributeSetsInitialized, periods, places, placesInitialized, placesActiveKey, scopes, activeScopeConfig, themes) => {
		let attrs = null, attrSets = null, plcs = null, activeScopeStyle = null;

		if (attributes){
			attrs = attributes;
		} else if (attributesInitialized){
			attrs = [];
		}

		if (attributeSets){
			attrSets = attributeSets;
		} else if (attributeSetsInitialized){
			attrSets = [];
		}

		if (places){
			plcs = places;
		} else if (placesInitialized){
			plcs = [];
		}

		if (activeScopeConfig && activeScopeConfig.style && VisualsConfig[activeScopeConfig.style]){
			activeScopeStyle = VisualsConfig[activeScopeConfig.style];
		}

		return {
			activeKeys: {
				places: [placesActiveKey]
			},
			activeScopeStyle,
			attributes: attrs,
			attributeSets: attrSets,
			dataview,
			periods,
			places: plcs,
			scopes,
			themes
		}
	}
);

const isActiveUnreceived = createSelector(
	[getActive],
	(active) => {
		return active && active.unreceived;
	}
);

export default {
	getDataForInitialLoad,
	getSubstate,
	getView: getByKey,
	getViews: getAll,
	getActive,
	getActiveKey,
	getAllForActiveScope,
	getViewsForScope,
	isActiveUnreceived
};