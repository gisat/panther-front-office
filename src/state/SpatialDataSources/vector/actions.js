import ActionTypes from '../../../constants/ActionTypes';

import _ from 'lodash';
import path from 'path';
import fetch from 'isomorphic-fetch';

import Select from '../../Select';

import common from '../../_common/actions';

const TTL = 3;

const useKeys = common.useKeys(Select.spatialDataSources.vector.getSubstate, 'spatial', ActionTypes.SPATIAL_DATA_SOURCES.VECTOR, 'data');
const useKeysClear = common.useKeysClear(ActionTypes.SPATIAL_DATA_SOURCES.VECTOR);
const useIndexed = common.useIndexed(Select.spatialDataSources.vector.getSubstate, 'spatial', ActionTypes.SPATIAL_DATA_SOURCES.VECTOR, 'data');
const useIndexedBatch = common.useIndexedBatch('spatial', ActionTypes.SPATIAL_DATA_SOURCES.VECTOR, 'data');
const useIndexedClear = common.useIndexedClear(ActionTypes.SPATIAL_DATA_SOURCES.VECTOR);
const clearIndex = common.clearIndex(ActionTypes.SPATIAL_DATA_SOURCES.VECTOR);
const addBatch = common.addBatch(ActionTypes.SPATIAL_DATA_SOURCES.VECTOR);
const addBatchIndex = common.addBatchIndex(ActionTypes.SPATIAL_DATA_SOURCES.VECTOR);



// ============ creators ===========
function loadLayerData(filter, componentId) {
	return (dispatch, getState) => {
		let additionalParams = {};
		let geometriesAccuracy = Select.app.getLocalConfiguration(getState(), 'geometriesAccuracy');

		if (geometriesAccuracy) {
			additionalParams.transformation = {
				snapToGrid: {
					size: geometriesAccuracy
				},
				transform: 4326
			}
		}

		return dispatch(useIndexedBatch(null, filter, null, componentId, 'spatialDataSourceKey', additionalParams));
	}
}

// ============ export ===========

export default {
	addBatch,
	addBatchIndex,

	loadLayerData,
	useKeys,
	useKeysClear,
	useIndexed,
	useIndexedClear,
	clearIndex
}
