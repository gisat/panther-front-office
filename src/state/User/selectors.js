import {createSelector} from 'reselect';
import _ from 'lodash';

const isLoggedIn = state => state.user.isLoggedIn;
const isAdmin = state => state.user.isAdmin;

export default {
	isAdmin: isAdmin,
	isLoggedIn: isLoggedIn
};