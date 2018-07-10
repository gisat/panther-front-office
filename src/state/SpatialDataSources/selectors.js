import {createSelector} from 'reselect';
import _ from 'lodash';

import vectorSelectors from './vector/selectors';

const getData = (state) => state.spatialDataSources.main.data;


const getDataSource = createSelector(
	[getData, (state, key) => (key)],
	(sources, key) => {
		return key ? _.find(sources, {key: key}) : null;
	}
);

const filter = (state, key, data) => {
	let models = getData(state);
	return _.filter(models, model => {
		return _.find(data, (value) => {return value === model[key]});
	});
};

export default {
	filter: filter,
	getData: getData,
	getDataSource: getDataSource,
	vector: vectorSelectors
};