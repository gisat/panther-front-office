import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import common from "../_common/actions";


// ============ creators ===========
const useIndexedRegister = (componentId, filterByActive, filter, order, start, length) => common.useIndexedRegister(ActionTypes.ATTRIBUTE_RELATIONS, componentId, filterByActive, filter, order, start, length);
const ensureIndexed = (filter, order, start, length) => common.ensureIndexed(Select.attributeRelations.getSubstate, 'attribute', filter, order, start, length, ActionTypes.ATTRIBUTE_RELATIONS, 'relations');

// ============ actions ===========


// ============ export ===========

export default {
    useIndexedRegister,
    ensureIndexed
}
