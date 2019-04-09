import {createSelector} from 'reselect';
import _ from 'lodash';

const getAllByKey = (state) => state.components;

const getDataByComponentKey = createSelector(
	[
		getAllByKey,
		(state, key) => key
	],
	(components, key) => {
		if (components && key && components[key]) {
			return components[key];
		} else {
			return null;
		}
	}
);

const get = createSelector(
	[
		getDataByComponentKey,
		(state, key, path) => path,
	],
	(componentState, path) => _.get(componentState, path, null)
);

export default {
	get,
	getDataByComponentKey,
	getStateToSave: getAllByKey
}
