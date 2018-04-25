import {createSelector} from 'reselect';
import _ from 'lodash';

const isLoggedIn = state => state.user.isLoggedIn;
const isAdmin = state => state.user.isAdmin;
const isDromasAdmin = state => {
	let isDromasAdmin = false;
	state.user.groups.forEach(group => {
		if(group.name === 'Kontrola LPIS admin') {
			isDromasAdmin = true;
		}
	});
	return isDromasAdmin || state.user.isAdmin;
};
const groups = state => state.user.groups;

export default {
	isAdmin: isAdmin,
	isLoggedIn: isLoggedIn,
	groups: groups,
	isDromasAdmin: isDromasAdmin
};