import {createSelector} from 'reselect';
import _ from 'lodash';

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

const getActiveUserPermissionsTowards = createSelector(
	[getActiveUser],
	(user) => {
		if (user && user.permissionsTowards){
			return user.permissionsTowards;
		} else {
			return null;
		}
	}
);

const hasActiveUserPermissionToCreate = createSelector(
	[getActiveUserPermissionsTowards, (state, type) => type],
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
	groups: groups,

	hasActiveUserPermissionToCreate: hasActiveUserPermissionToCreate,

	isAdmin: isAdmin,
	isLoggedIn: isLoggedIn,
	isDromasAdmin: isDromasAdmin
};