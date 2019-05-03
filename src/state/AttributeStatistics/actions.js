import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import common from "../_common/actions";

// ============ creators ===========
const useIndexed = common.useIndexed(Select.attributeDataSources.getSubstate, 'attribute', ActionTypes.ATTRIBUTE_STATISTICS, 'data');
const useIndexedClear = common.useIndexedClear(ActionTypes.ATTRIBUTE_STATISTICS);
const useIndexedBatch = common.useIndexedBatch('attribute', ActionTypes.ATTRIBUTE_STATISTICS, 'statistic');

function loadFilteredData(filter, componentId) {
	return (dispatch) => dispatch(useIndexedBatch(null, filter, null, componentId, 'attributeDataSourceKey'));
}

// ============ export ===========

export default {
    useIndexed,
    useIndexedClear,
    loadFilteredData
}
