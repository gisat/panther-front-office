import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

import common from '../_common/actions';
import LayerPeriods from "../LayerPeriods/actions";
import ScenariosActions from "../Scenarios/actions";
import SpatialRelationsActions from "../SpatialRelations/actions";
import SpatialDataSourcesActions from "../SpatialDataSources/actions";
import Select from "../Select";
import Action from "../Action";


// ============ creators ===========

const add = common.add(ActionTypes.PLACES);
const create = common.create(Select.places.getSubstate, 'places', ActionTypes.PLACES);
const deleteItem = common.delete(Select.places.getSubstate, 'places', ActionTypes.PLACES);
const saveEdited = common.saveEdited(Select.places.getSubstate, 'places', ActionTypes.PLACES);
const setActiveKey = common.setActiveKey(ActionTypes.PLACES);
const setActiveKeys = common.setActiveKeys(ActionTypes.PLACES);
const updateEdited = common.updateEdited(Select.places.getSubstate, ActionTypes.PLACES);
const useIndexed = common.useIndexed(Select.places.getSubstate, 'places', ActionTypes.PLACES);
const useIndexedClear = common.useIndexedClear(ActionTypes.PLACES);
const useKeys = common.useKeys(Select.places.getSubstate, 'places', ActionTypes.PLACES);
const useKeysClear = common.useKeysClear(ActionTypes.PLACES);
const refreshUses = common.refreshUses(Select.places.getSubstate, `places`, ActionTypes.PLACES);
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.places.getSubstate, 'places', ActionTypes.PLACES);

// ============ export ===========

export default {
	add,
	create,
	delete: deleteItem,
	ensureIndexesWithFilterByActive,
	refreshUses,

	saveEdited,
	setActiveKey,
	setActiveKeys,

	updateEdited,
	useIndexed,
	useIndexedClear,
	useKeys,
	useKeysClear
}
