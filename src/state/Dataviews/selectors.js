import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import _ from 'lodash';
import common from "../_common/selectors";
import UsersSelectors from '../Users/selectors';

const getSubstate = state => state.dataviews;

const getAll = common.getAll(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getByKey = common.getByKey(getSubstate);

const getViewsForActiveUser = createCachedSelector(
	getAll,
	UsersSelectors.getActiveKey,
	UsersSelectors.getGroupKeysForActiveUser,
	UsersSelectors.isAdminOrAdminGroupMember,
	(views, userKey, groupKeys, isAdmin) => {
		if (!views || !views.length) {
			return [];
		}

		else if (!userKey) {
			return views;
		}

		else if (isAdmin) {
			return views.map(view => {
				let extendedView = _.cloneDeep(view);
				extendedView.deletable = true;
				extendedView.editable = true;
				return extendedView;
			});
		}

		// return all views, which have GET permission for active user or for a group that the active user is a member of
		else {
			let extendedViews = [];
			views.map(view => {
				if (view.permissions) {
					let hasGetPermissions = hasViewPermissionForActiveUser(view.permissions, userKey, groupKeys, "GET");

					if (hasGetPermissions){
						let extendedView = _.cloneDeep(view);
						let hasDeletePermissions = hasViewPermissionForActiveUser(view.permissions, userKey, groupKeys, "DELETE");
						let hasPutPermissions = hasViewPermissionForActiveUser(view.permissions, userKey, groupKeys, "PUT");

						if (hasDeletePermissions){
							extendedView.deletable = true;
						}
						if (hasPutPermissions){
							extendedView.editable = true;
						}
						extendedViews.push(extendedView);
					}
				}
			});

			return extendedViews;
		}
	}
)(
	(state, views, userKey) => {return userKey ? userKey : "guest"}
);


const getViewsForScopeAndActiveUser = createCachedSelector(
	getViewsForActiveUser,
	(state, scope) => scope,
	(views, scope) => {
		if (!scope) {
			return [];
		} else {
			return _.filter(views, (view) => {
				return view.data.dataset === scope.key
			});
		}
	}
)(
	(state, scope) => scope.key
);


const hasGuestGroupGetPermission = createSelector(
	getByKey,
	(view) => {
		if (view && view.permissions && view.permissions.group) {
			return !!_.find(view.permissions.group, {'id': 2});
		}
		return false;
	}
);


// helpers
const hasViewPermissionForActiveUser = function(permissions, userKey, groupKeys, method){
	let hasPermission = false;
	if (permissions && permissions.group && permissions.group.length){
		hasPermission = !!(_.find(permissions.group, (groupPermission) => {
			return (groupPermission.permission === method) && ((groupPermission.id === 2) || (
				_.includes(groupKeys, groupPermission.id)
			));
		}));
		if (hasPermission){
			return hasPermission;
		}
	}
	if (permissions && permissions.user && permissions.user.length){
		return !!(_.find(permissions.user, (userPermission) => {
			return (userPermission.id === userKey) && (userPermission.permission === method);
		}));
	}
};

export default {
	getViewsForScopeAndActiveUser,
	getView: getByKey,
	getViews: getAll,
	getSubstate,
	getActiveKey,

	hasGuestGroupGetPermission
};