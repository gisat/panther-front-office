import {createSelector} from 'reselect';
import _ from 'lodash';

const getKey = state => state.app.key;
const getCompleteLocalConfiguration = state => state.app.localConfiguration;

const getLocalConfiguration = createSelector(
	[
		getCompleteLocalConfiguration,
		(state, path) => path,
	],
	(localConfiguration, path) => _.get(localConfiguration, path, null)
);

export default {
	getKey,
	getLocalConfiguration
};