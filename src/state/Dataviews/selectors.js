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

const getSubstate = state => state.dataviews;

const getAll = common.getAll(getSubstate);
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
				return view.data.dataset === scope.key
			});
		}
	}
);

const getDataForInitialLoad = createSelector(
	[getActive,
		AttributesSelectors.getAllForDataview,
		AttributeSetsSelectors.getAllForDataview,
		PeriodsSelectors.getAllForDataview,
		PlacesSelectors.getAllForDataview,
		ScopesSelectors.getAllForDataview,
		ThemesSelectors.getAllForDataview],
	(dataview, attributes, attributeSets, periods, places, scopes, themes) => {
		return {
			attributes,
			attributeSets,
			dataview,
			periods,
			places,
			scopes,
			themes
		}
	}
);

export default {
	getDataForInitialLoad,
	getSubstate,
	getView: getByKey,
	getViews: getAll,
	getActive,
	getActiveKey,
	getViewsForScope
};