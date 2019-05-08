import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import common from "../_common/actions";

// ============ creators ===========
const useKeys = common.useKeys(Select.attributeDataSources.getSubstate, 'attribute', ActionTypes.ATTRIBUTE_DATA_SOURCES, 'dataSources');
const useKeysClear = common.useKeysClear(ActionTypes.ATTRIBUTE_DATA_SOURCES);
// ============ export ===========

export default {
    useKeys,
    useKeysClear,
}
