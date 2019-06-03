import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import common from "../_common/actions";

// ============ creators ===========
const useIndexed = common.useIndexed(Select.attributeData.getSubstate, 'attribute', ActionTypes.ATTRIBUTE_DATA, 'data');
const useIndexedClear = common.useIndexedClear(ActionTypes.ATTRIBUTE_DATA);
const useIndexedBatch = common.useIndexedBatch('attribute', ActionTypes.ATTRIBUTE_DATA, 'data');

function loadFilteredData(filter, componentId) {
	return (dispatch) => dispatch(useIndexedBatch(null, filter, null, componentId, 'attributeDataSourceKey'));
}

// ============ export ===========

export default {
    useIndexed,
    useIndexedClear,
    loadFilteredData
}
