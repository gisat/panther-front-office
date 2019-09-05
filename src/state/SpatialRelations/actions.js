import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import common from "../_common/actions";


// ============ creators ===========
const useIndexedRegister = (componentId, filterByActive, filter, order, start, length) => common.useIndexedRegister(ActionTypes.SPATIAL_RELATIONS, componentId, filterByActive, filter, order, start, length);
const ensureIndexed = (filter, order, start, length) => common.ensureIndexed(Select.spatialRelations.getSubstate, 'spatial', filter, order, start, length, ActionTypes.SPATIAL_RELATIONS, 'relations');
const add = common.add(ActionTypes.SPATIAL_RELATIONS);
const useIndexedClearAll = common.useIndexedClearAll(ActionTypes.SPATIAL_RELATIONS);
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.spatialRelations.getSubstate, 'spatial', ActionTypes.SPATIAL_RELATIONS, 'relations');


// ============ actions ===========


// ============ export ===========

export default {
    add,
    useIndexedRegister,
    useIndexedClearAll,
    ensureIndexed,

    ensureIndexesWithFilterByActive
}
