import {createSelector} from 'reselect';
import _ from 'lodash';

const getData = (state) => state.spatialRelations.data;

const filter = (state, key, data) => {
	let models = getData(state);
	return _.filter(models, model => {
		return _.find(data, (value) => {return value === model[key]});
	});
};

export default {
	filter: filter
};