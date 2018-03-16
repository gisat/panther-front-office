import {createSelector} from 'reselect';
import _ from 'lodash';

const getActiveScopeKey = state => state.scopes.activeScopeKey;

export default {
	getActiveScopeKey: getActiveScopeKey
};