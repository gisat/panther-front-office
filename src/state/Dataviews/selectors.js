import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import _ from 'lodash';
import common from "../_common/selectors";

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
	[PeriodsSelectors.getAllForDataview,
		PlacesSelectors.getAllForDataview,
		ScopesSelectors.getAllForDataview,
		ThemesSelectors.getAllForDataview],
	(periods, places, scopes, themes) => {
		return {
			periods: periods,
			places: places,
			scopes: scopes,
			themes: themes
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