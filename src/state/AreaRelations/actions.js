import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import common from "../_common/actions";


// ============ creators ===========
const useIndexedRegister = (componentId, filterByActive, filter, order, start, length) => common.useIndexedRegister(ActionTypes.AREA_RELATIONS, componentId, filterByActive, filter, order, start, length);
const ensureIndexed = (filter, order, start, length) => common.ensureIndexed(Select.areaRelations.getSubstate, 'area', filter, order, start, length, ActionTypes.AREA_RELATIONS, 'relations');
const add = common.add(ActionTypes.AREA_RELATIONS);
const useIndexedClearAll = common.useIndexedClearAll(ActionTypes.AREA_RELATIONS);


// ============ export ===========

export default {
	add,
	useIndexedRegister,
	useIndexedClearAll,
	ensureIndexed,
}
