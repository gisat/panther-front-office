import {createSelector} from 'reselect';
import _ from 'lodash';

const isLoggedIn = state => state.users.isLoggedIn;
const isAdmin = state => state.users.isAdmin;
const isDromasAdmin = state => {
	let isDromasAdmin = false;
	state.users.groups.forEach(group => {
		if(group.name === 'Aktualizace LPIS admin') {
			isDromasAdmin = true;
		}
	});
	return isDromasAdmin || state.users.isAdmin;
};
const groups = state => state.users.groups;

export default {
	isAdmin: isAdmin,
	isLoggedIn: isLoggedIn,
	groups: groups,
	isDromasAdmin: isDromasAdmin
};