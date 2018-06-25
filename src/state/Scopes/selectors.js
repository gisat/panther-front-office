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

const getActiveScopeConfiguration = createSelector(
	[getActiveScopeData],
	(data) => {
		return data && data.configuration ? data.configuration : null;
	}
);

const getPucsSourceVectorLayerTemplate = createSelector(
	[getActiveScopeConfiguration],
	(conf) => {
		return conf && conf.pucsLandUseScenarios && conf.pucsLandUseScenarios.templates && conf.pucsLandUseScenarios.templates.sourceVector ? conf.pucsLandUseScenarios.templates.sourceVector : null;
	}
);

export default {
	getActiveScopeConfiguration: getActiveScopeConfiguration,
	getActiveScopeData: getActiveScopeData,
	getActiveScopeKey: getActiveScopeKey,
	getScopes: getScopes,

	getPucsSourceVectorLayerTemplate: getPucsSourceVectorLayerTemplate
};