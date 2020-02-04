import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import _ from 'lodash';

import common from "../_common/selectors";
import ScopeSelectors from '../Scopes/selectors';

const DEFAULT_CATEGORY = 'metadata';

const getSubstate = state => state.users;
const getGroupsSubstate = state => state.users.groups;

const getAll = common.getAll(getSubstate);
const getGroups = common.getAll(getGroupsSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getActive = common.getActive(getSubstate);
const getByKey = common.getByKey(getSubstate);

const isLoggedIn = state => !!state.users.activeKey;
const isAdmin = state => state.users.isAdmin;

const getById = createSelector(
	[
		getAll,
		(state, userId) => userId,
	],
	(users, userId) => {
		if (users) {
			return users.find(user => user.id === userId);
		}
		return false;
	}
);

const isAdminGroupMember = createSelector(
	[getActive],
	(user) => {
		if (user) {
			return _.includes(user.groups, 1);
		}
		return false;
	}
);

const getActiveUserPermissions = createSelector(
	[getActive],
	(user) => {
		if (user && user.permissions){
			return user.permissions;
		} else {
			return null;
		}
	}
);

const isAdminOrAdminGroupMember = createSelector(
	[isAdmin, isAdminGroupMember],
	(isAdmin, isAdminGroupMember) => {
		return isAdmin || isAdminGroupMember;
	}
);

const getGroupKeysForActiveUser = createSelector(
	[getActive],
	(activeUser) => {
		if (activeUser && activeUser.groups) {
			return activeUser.groups;
		} else {
			return [];
		}
	}
);

const hasActiveUserPermissionToCreate = createSelector(
	[
		getActiveUserPermissions,
		(state, type) => type,
		(state, type, category) => category
	],
	(permissions, type, category = DEFAULT_CATEGORY) => {
		return (type && permissions && permissions[category] && permissions[category][type] && permissions[category][type].create);
	}
);

const isDromasAdmin = state => {
	let isDromasAdmin = false;
	if (state.users && state.users.data && state.users.data.length) {
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

const getActiveUserDromasLpisChangeReviewGroup = createSelector(
	[getGroupKeysForActiveUser, ScopeSelectors.getActiveScopeConfiguration],
	(activeUserGroupKeys, activeScopeConfiguration) => {
		if (_.includes(activeUserGroupKeys, activeScopeConfiguration.dromasLpisChangeReview.groups.gisatAdmins)) {
			return 'gisatAdmins';
		} else if (_.includes(activeUserGroupKeys, activeScopeConfiguration.dromasLpisChangeReview.groups.szifAdmins)) {
			return 'szifAdmins';
		} else if (_.includes(activeUserGroupKeys, activeScopeConfiguration.dromasLpisChangeReview.groups.gisatUsers)) {
			return 'gisatUsers';
		} else if (_.includes(activeUserGroupKeys, activeScopeConfiguration.dromasLpisChangeReview.groups.szifUsers)) {
			return 'szifUsers';
		} else {
			return null;
		}
	}
);


export default {
	getAll,

	getActive,
	getByKey,
	getById,

	getActiveKey: getActiveKey,
	getActiveUser: getActive,
	getGroupKeysForActiveUser: getGroupKeysForActiveUser,
	getGroupsForActiveUser: getGroupKeysForActiveUser,
	getUsers: getAll,
	getGroups: getGroups,
	getSubstate: getSubstate,
	getGroupsSubstate,

	hasActiveUserPermissionToCreate,

	isAdmin: isAdmin,
	isAdminGroupMember: isAdminGroupMember,
	isAdminOrAdminGroupMember: isAdminOrAdminGroupMember,
	isLoggedIn: isLoggedIn,
	isDromasAdmin: isDromasAdmin,

	getActiveUserDromasLpisChangeReviewGroup: getActiveUserDromasLpisChangeReviewGroup
};