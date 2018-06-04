import {createSelector} from 'reselect';
import _ from 'lodash';

const getData = (state) => state.spatialRelations.data;

const getActivePlaceKey = (state) => state.places.activeKey;

const getActivePlaceDataSourceIds = createSelector(
	[getData, getActivePlaceKey],
	(models, acitvePlaceKey) => {
		let filteredByPlace = _.filter(models, {'place_id': acitvePlaceKey});
		return filteredByPlace.map(relation => {return relation['data_source_id']});
	}
);

export default {
	getActivePlaceDataSourceIds: getActivePlaceDataSourceIds,
};