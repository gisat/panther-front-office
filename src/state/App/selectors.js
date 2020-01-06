import {createSelector} from 'reselect';
import _ from 'lodash';

const getKey = state => state.app.key;
const getCompleteConfiguration = state => state.app.configuration;
const getCompleteLocalConfiguration = state => state.app.localConfiguration;

const getConfiguration = createSelector(
	[
		getCompleteConfiguration,
		(state, path) => path,
	],
	(configuration, path) => _.get(configuration, path, null)
);

const getLocalConfiguration = createSelector(
	[
		getCompleteLocalConfiguration,
		(state, path) => path,
	],
	(localConfiguration, path) => _.get(localConfiguration, path, null)
);

export default {
	getKey,
	getConfiguration,
	getCompleteConfiguration,
	getLocalConfiguration
};