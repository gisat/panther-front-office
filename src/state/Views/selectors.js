import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import _ from 'lodash';

import UsersSelectors from '../Users/selectors';

const getViews = state => state.views.data;
const getActiveKey = state => state.views.activeKey;


const getView = createCachedSelector(
	getViews,
	(state, viewKey) => viewKey,
	(views, key) => {
		if (views){
			return _.find(views, {key: key});
		}
		return null;
	}
)(
	(state, viewKey) => viewKey
);

const getViewsForScope = createCachedSelector(
	getViews,
	(state, scope) => scope,
	(views, scope) => {
		if (!scope){
			return [];
		} else {
			return _.filter(views, (view) => {return view.data.dataset === scope.key});
		}
	}
)(
	(state, scope) => scope.key
);

// todo cache by user.key
const getViewsForScopeAndActiveUser = createSelector(
	getViewsForScope,
	UsersSelectors.getActiveKey,
	UsersSelectors.getGroupKeysForActiveUser,
	(views, userKey, groupKeys) => {
		if (!views || !views.length){
			return [];
		} else if (!userKey){
			return _.filter(views, (view) => {
				if (view.permissions && view.permissions.group){
					return !!_.find(view.permissions.group, {'id': 2});
				}
				return false;
			});
		} else {
			// todo apply permissions for user and user group
			// add deletable and editable parameter
			// do not miss guest group
			debugger;
			return views;
		}
	}
);

const hasGuestGroupGetPermission = createSelector(
	getView,
	(view) => {
		if (view && view.permissions && view.permissions.group){
			return !!_.find(view.permissions.group, {'id': 2});
		}
		return false;
	}
);

export default {
	getViewsForScope: getViewsForScope,
	getViewsForScopeAndActiveUser: getViewsForScopeAndActiveUser,
	getViews: getViews,
	getActiveKey: getActiveKey,

	hasGuestGroupGetPermission: hasGuestGroupGetPermission
};