import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import common from "../_common/actions";

// ============ creators ===========
const useIndexed = common.useIndexed(Select.attributeDataSources.getSubstate, 'attribute', ActionTypes.ATTRIBUTE_DATA_SOURCES, 'data');
const useIndexedClear = common.useIndexedClear(ActionTypes.ATTRIBUTE_DATA_SOURCES);
// ============ export ===========

export default {
    useIndexed,
    useIndexedClear
}
