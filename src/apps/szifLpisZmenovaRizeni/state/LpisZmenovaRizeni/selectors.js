import {createSelector} from 'reselect';

import UsersSelectors from '../../../../state/Users/selectors';
import AppSelectors from '../../../../state/App/selectors';

const getGroupByGroupId = createSelector([
		AppSelectors.getCompleteConfiguration,
		(state, groupId) => groupId,
	],
	(configuration, groupId) => {
		if(!configuration || (!groupId && groupId !== 0)) {
			return undefined;
		}
		for(const [group, id] of Object.entries(configuration.permissionGroups)) {
			if(groupId === id) {
				return group;
			}
		}

		//if no group found
		return undefined;
});

const getActiveUserGroups = (state) => {
	const user = UsersSelectors.getActiveUser(state);
	const userLpisGroups = user.groups.map(groupId => getGroupByGroupId(state, groupId)).filter(g => g);
	return userLpisGroups;
}

const activeUserCanAddCase = (state) => {
	const groups = getActiveUserGroups(state);
	const authorityRoles = ['szifUsers', 'szifAdmins'] // gisatUsers, gisatAdmins
	return authorityRoles.some((role => groups.includes(role)));
};

export default {
	getActiveUserGroups,
	activeUserCanAddCase,
};