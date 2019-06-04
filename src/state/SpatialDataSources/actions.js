import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import vectorActions from './vector/actions';
import common from "../_common/actions";

// ============ creators ===========
const useKeys = common.useKeys(Select.spatialDataSources.getSubstate, 'spatial', ActionTypes.SPATIAL_DATA_SOURCES, 'dataSources');
const useKeysClear = common.useKeysClear(ActionTypes.SPATIAL_DATA_SOURCES);
const add = common.add(ActionTypes.SPATIAL_DATA_SOURCES);

// ============ export ===========

export default {
	vector: vectorActions,

	add,
	useKeys,
	useKeysClear,

}
