import {createSelector} from 'reselect';
import _ from 'lodash';

const getGroups = state => state.userGroups.data;

export default {
	getGroups: getGroups
};