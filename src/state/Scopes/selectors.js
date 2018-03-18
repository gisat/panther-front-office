import {createSelector} from 'reselect';
import _ from 'lodash';

const getActiveScopeKey = state => state.scopes.activeScopeKey;
const getScopes = state => state.scopes.data;

const getActiveScopeData = createSelector(
	[getScopes, getActiveScopeKey],
	(scopes, activeKey) => {
		return _.find(scopes, function(scope){
			return scope.key === activeKey;
		});
	}
);

export default {
	getActiveScopeData: getActiveScopeData,
	getActiveScopeKey: getActiveScopeKey,
	getScopes: getScopes
};