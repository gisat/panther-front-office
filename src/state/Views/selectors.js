import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import _ from 'lodash';

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

const getViewsForScope = createSelector(
	[getViews, (state, scope) => (scope)],
	(views, scope) => {
		if (!scope){
			return [];
		} else {
			return _.filter(views, (view) => {return view.data.dataset === scope.key});
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
	getViews: getViews,
	getActiveKey: getActiveKey,

	hasGuestGroupGetPermission: hasGuestGroupGetPermission
};