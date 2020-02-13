import {createSelector} from 'reselect';

import UsersSelectors from '../../../../state/Users/selectors';
import AppSelectors from '../../../../state/App/selectors';
import ComponentsSelectors from '../../../../state/Components/selectors';

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
	const userLpisGroups = user && user.groups && user.groups.map(groupId => getGroupByGroupId(state, groupId)).filter(g => g) || [];
	return userLpisGroups;
}

const activeUserCanAddCase = (state) => {
	const groups = getActiveUserGroups(state);
	const authorityRoles = ['szifUsers', 'szifAdmins', 'szifRegionAdmins'] // gisatUsers, gisatAdmins
	return authorityRoles.some((role => groups.includes(role)));
};

const getUsedSourcesForAllMaps = (state) => {
	const szifZmenovaRizeni_ActiveLayers = ComponentsSelectors.getDataByComponentKey(state, 'szifZmenovaRizeni_ActiveLayers');
	const sources = [];
	for(const [mapKey, layers] of Object.entries(szifZmenovaRizeni_ActiveLayers)) {
		if(layers && layers[0] && layers[0].options.title) {
			let title = layers[0].options.title;
			const type = layers[0].options.type;
			if(type === 'sentinel') {
				title = `${layers[0].options.title} (${layers[0].time})`;
			} else if(title === "Ortofoto východ/západ") {
				title = `Ortofoto ${layers[0].options.info}`;
			}
			sources.push(title);
		}
	}
	return sources;
};

export default {
	getActiveUserGroups,
	activeUserCanAddCase,
	getUsedSourcesForAllMaps,
};