import {createSelector} from 'reselect';
import _ from 'lodash';

import vectorSelectors from './vector/selectors';
import common from "../_common/selectors";
import SpatialRelations from "../SpatialRelations/selectors";

const getSubstate = (state) => state.spatialDataSources;
const getAllAsObject = common.getAllAsObject(getSubstate);

const getFilteredGroupedByLayerKey = createSelector(
	[
		getAllAsObject,
		SpatialRelations.getDataSourceKeysGroupedByLayerKey
	],
	(dataSources, groupedKeys) => {
		if (dataSources && !_.isEmpty(dataSources) && groupedKeys) {
			let groupedSources = {};
			_.forIn(groupedKeys, (keys, layerKey) => {
				let sources = [];
				keys.forEach(key => {
					if (dataSources[key]) {
						sources.push(dataSources[key])
					}
				});

				if (sources.length) {
					groupedSources[layerKey] = sources;
				}
			});
			return !_.isEmpty(groupedSources) ? groupedSources : null;
		} else {
			return null;
		}
	}
);

export default {
	getSubstate,

	getFilteredGroupedByLayerKey,

	vector: vectorSelectors
};