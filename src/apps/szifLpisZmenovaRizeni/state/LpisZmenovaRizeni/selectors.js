import {createSelector} from 'reselect';

import UsersSelectors from '../../../../state/Users/selectors';
import AppSelectors from '../../../../state/App/selectors';

const getPermissionGroupByUserId = createSelector([
		AppSelectors.getCompleteConfiguration,
		(state, userId) => userId,
	],
	(configuration, userId) => {
		if(!configuration || (!userId && userId !== 0)) {
			return undefined;
		}
		for(const [group, id] of Object.entries(configuration.permissionGroups)) {
			if(userId === id) {
				return group;
			}
		}

		//if no group found
		return undefined;
});

const getActiveUserAppRole = (state) => {
	const user = UsersSelectors.getActiveUser(state);
	const userLpisGroup = getPermissionGroupByUserId(state, user.key);
	return userLpisGroup;
}

const activeUserCanAddCase = (state) => {
	const role = getActiveUserAppRole(state);
	const authorityRoles = ['szifUsers', 'szifAdmins'] // gisatUsers, gisatAdmins
	return authorityRoles.includes(role);
};

export default {
	getActiveUserAppRole,
	activeUserCanAddCase,
};