import {createSelector} from 'reselect';
import _ from 'lodash';

import vectorSelectors from './vector/selectors';
import common from "../_common/selectors";
import SpatialRelations from "../SpatialRelations/selectors";

const getSubstate = (state) => state.spatialDataSources;
const getAllAsObject = common.getAllAsObject(getSubstate);

const getByLayerTemplateKey = createSelector(
	[getAllAsObject,
	SpatialRelations.getDataSourceKeysByLayerTemplateKeys],
	(dataSources, keys) => {
		if (keys && keys.length && dataSources && !_.isEmpty(dataSources)) {
			let selectedDataSources = [];
			keys.forEach((key) => {
				if (dataSources[key]){
					selectedDataSources.push(dataSources[key]);
				}
			});
			return selectedDataSources.length ? selectedDataSources : null;
		} else {
			return null;
		}
	}
);

export default {
	getSubstate,

	getByLayerTemplateKey,

	vector: vectorSelectors
};