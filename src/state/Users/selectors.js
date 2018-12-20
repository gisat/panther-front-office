import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import _ from 'lodash';

import UserGroupSelectors from '../UserGroups/selectors';
import scopeSelectors from '../Scopes/selectors';

const getActiveKey = state => state.users.activeKey;
const getUsers = state => state.users.data;
const groups = state => state.users.groups;
const isLoggedIn = state => state.users.isLoggedIn;
const isAdmin = state => state.users.isAdmin;

const getActiveUser = createSelector(
	[getUsers, getActiveKey],
	(models, activeKey) => {
		if (models && models.length && activeKey){
			return _.find(models, {'key': activeKey});
		} else {
			return null;
		}
	}
);

const isAdminGroupMember = createSelector(
	[getActiveUser],
	(user) => {
		if (user){
			let adminGroup = _.find(user.groups, (group) => {return group._id === 1});
			return !!adminGroup;
		}
		return false;
	}
);

const isAdminOrAdminGroupMember = createSelector(
	[isAdmin, isAdminGroupMember],
	(isAdmin, isAdminGroupMember) => {
		return isAdmin || isAdminGroupMember;
	}
);

const getGroupsForActiveUser = createSelector(
	[getActiveUser, UserGroupSelectors.getGroups],
	(activeUser, groups) => {
		if (activeUser && activeUser.groups && activeUser.groups.length){
			return activeUser.groups;
		} else {
			return _.filter(groups, (group) => {
				return (_.find(group.users, (user) => {return user === (activeUser && activeUser.key)})) || group.key === 2;
			});
		}
	}
);

const getGroupKeysForActiveUser = createSelector(
	[getGroupsForActiveUser, getActiveUser],
	(groups, activeUser) => {
		if (activeUser && activeUser.groups){
			return activeUser.groups.map(group => {return group.key ? group.key : (group.id ? group.id : group._id) });
		} else {
			return [];
		}
	}
);

const getGroupsForActiveUserPermissionsTowards = createSelector(
	[getGroupsForActiveUser],
	(groups) => {
		if (groups && groups.length){
			let permissions = [];
			groups.map(group => {
				if (group.permissionsTowards){
					permissions = [...permissions, ...group.permissionsTowards];
				} else if (group.permissions) {
					permissions = [...permissions, ...group.permissions];
				}
			});
			return permissions;
		} else {
			return [];
		}
	}
);

const getActiveUserPermissionsTowards = createSelector(
	[getActiveUser],
	(user) => {
		if (user && user.permissionsTowards){
			return user.permissionsTowards;
		} else {
			return [];
		}
	}
);

/**
 * This selector puts together permissionsTowards of acitve user and groups, where active user belongs
 */
const getActiveUserPermissionsTowardsCombined = createSelector(
	[getActiveUserPermissionsTowards, getGroupsForActiveUserPermissionsTowards],
	(userPermissions, groupsPermissions) => {
		return [...userPermissions, ...groupsPermissions];
	}
);

const hasActiveUserPermissionToCreate = createSelector(
	[getActiveUserPermissionsTowardsCombined, (state, type) => type],
	(permissionsTowards, type) => {
		if (!permissionsTowards || !permissionsTowards.length){
			return false;
		} else {
			let permission = _.find(permissionsTowards, (per) => {return (per.resourceType === type) || (per.resourcetype === type)});
			return !!(permission && permission.permission === "POST");
		}
	}
);

const isDromasAdmin = state => {
    let isDromasAdmin = false;
    if(state.users && state.users.data && state.users.data.length) {
        const currentUser = state.users.data.filter(user => user.key === state.users.activeKey);
        if (currentUser.length > 0) {
            currentUser[0].groups.forEach(group => {
                if (group.name === 'Aktualizace LPIS Gisat admin') {
                    isDromasAdmin = true;
                }
            })
        }
    }
    return isDromasAdmin || state.users.isAdmin;
};

const getActiveUserDromasLpisChangeReviewGroup  = createSelector(
	[getGroupKeysForActiveUser, scopeSelectors.getActiveScopeConfiguration],
	(activeUserGroupKeys, activeScopeConfiguration) => {
		if (_.includes(activeUserGroupKeys, activeScopeConfiguration.dromasLpisChangeReview.groups.gisatAdmins)) {
			return 'gisatAdmins';
		} else if (_.includes(activeUserGroupKeys, activeScopeConfiguration.dromasLpisChangeReview.groups.szifAdmins)) {
			return 'szifAdmins';
		} else if (_.includes(activeUserGroupKeys, activeScopeConfiguration.dromasLpisChangeReview.groups.gisatUsers)){
			return 'gisatUsers';
		} else if (_.includes(activeUserGroupKeys, activeScopeConfiguration.dromasLpisChangeReview.groups.szifUsers)) {
			return 'szifUsers';
		} else {
			return null;
		}
	}
);


export default {
	getActiveKey: getActiveKey,
	getActiveUser: getActiveUser,
	getActiveUserPermissionsTowards: getActiveUserPermissionsTowards,
	getGroupKeysForActiveUser: getGroupKeysForActiveUser,
	getGroupsForActiveUser: getGroupKeysForActiveUser,
	getUsers: getUsers,

	groups: groups,

	hasActiveUserPermissionToCreate: hasActiveUserPermissionToCreate,

	isAdmin: isAdmin,
	isAdminGroupMember: isAdminGroupMember,
	isAdminOrAdminGroupMember: isAdminOrAdminGroupMember,
	isLoggedIn: isLoggedIn,
	isDromasAdmin: isDromasAdmin,

	getActiveUserDromasLpisChangeReviewGroup: getActiveUserDromasLpisChangeReviewGroup
};