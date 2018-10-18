import {createSelector} from 'reselect';
import _ from 'lodash';

const getData = (state) => state.spatialRelations.data;

const getActivePlaceKey = (state) => state.places.activeKey;

const getActivePlaceData = createSelector(
	[getData, getActivePlaceKey],
	(models, acitvePlaceKey) => {
		let filteredByPlace = _.filter(models, (model) => { return model.data['place_id'] === acitvePlaceKey});
		return filteredByPlace && filteredByPlace.length ? filteredByPlace : null;
	}
);

const getActivePlaceDataSourceIds = createSelector(
	[getData, getActivePlaceKey],
	(models, acitvePlaceKey) => {
		let filteredByPlace = _.filter(models, (model) => { return model.data['place_id'] === acitvePlaceKey});
		return filteredByPlace.map(relation => {return relation.data['data_source_id']});
	}
);

export default {
	getData: getData,
	getActivePlaceData: getActivePlaceData,
	getActivePlaceDataSourceIds: getActivePlaceDataSourceIds,
};