import {createSelector} from 'reselect';
import _ from 'lodash';
import Select from '../Select';

const getActiveKey = state => state.users.activeKey;
const getUsers = state => state.users.data;
const groups = state => state.users.groups;
const isLoggedIn = state => state.users.isLoggedIn;
const isAdmin = state => state.users.isAdmin || state.userGroups && state.userGroups.data &&
	state.userGroups.data.filter(group => group.name === 'admin' && group.users.indexOf(state.users.activeKey !== -1)).length > 0;

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

const getGroupsForActiveUser = createSelector(
	[getActiveKey, (state) => Select.userGroups.getGroups(state)],
	(activeUserKey, groups) => {
		return _.filter(groups, (group) => {
			return _.find(group.users, (user) => {return user === activeUserKey});
		});
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
			let permission = _.find(permissionsTowards, (per) => {return per.resourceType === type});
			return !!(permission && permission.permission === "POST");
		}
	}
);

const isDromasAdmin = state => {
	let isDromasAdmin = false;
	state.users.groups.forEach(group => {
		if(group.name === 'Aktualizace LPIS admin') {
			isDromasAdmin = true;
		}
	});
	return isDromasAdmin || state.users.isAdmin;
};

export default {
	getActiveUserPermissionsTowards: getActiveUserPermissionsTowards,
	getUsers: getUsers,

	groups: groups,

	hasActiveUserPermissionToCreate: hasActiveUserPermissionToCreate,

	isAdmin: isAdmin,
	isLoggedIn: isLoggedIn,
	isDromasAdmin: isDromasAdmin
};