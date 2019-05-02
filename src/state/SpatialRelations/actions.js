import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import common from "../_common/actions";


// ============ creators ===========
const useIndexedRegister = (componentId, filterByActive, filter, order, start, length) => common.useIndexedRegister(ActionTypes.SPATIAL_RELATIONS, componentId, filterByActive, filter, order, start, length);
const ensureIndexed = (filter, order, start, length) => common.ensureIndexed(Select.spatialRelations.getSubstate, 'spatial', filter, order, start, length, ActionTypes.SPATIAL_RELATIONS, 'relations');


// ============ actions ===========


// ============ export ===========

export default {
    useIndexedRegister,
    ensureIndexed
}
