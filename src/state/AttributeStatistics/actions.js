import ActionTypes from '../../constants/ActionTypes';

import common from "../_common/actions";

// ============ creators ===========
const useIndexedClear = common.useIndexedClear(ActionTypes.ATTRIBUTE_STATISTICS);
const useIndexedBatch = common.useIndexedBatch('attribute', ActionTypes.ATTRIBUTE_STATISTICS, 'statistic');

function loadFilteredData(filter, componentId) {
	return (dispatch) => dispatch(useIndexedBatch(null, filter, null, componentId, 'attributeDataSourceKey'));
}

// ============ export ===========

export default {
    useIndexedClear,
    loadFilteredData
}
