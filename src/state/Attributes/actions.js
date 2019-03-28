import _ from 'lodash';

import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========
const create = common.create(Select.attributes.getSubstate, 'attributes', ActionTypes.ATTRIBUTES);
const refreshUses = common.refreshUses(Select.attributes.getSubstate, `attributes`, ActionTypes.ATTRIBUTES);
const deleteItem = common.delete(Select.attributes.getSubstate, 'attributes', ActionTypes.ATTRIBUTES);
const saveEdited = common.saveEdited(Select.attributes.getSubstate, 'attributes', ActionTypes.ATTRIBUTES);
const updateEdited = common.updateEdited(Select.attributes.getSubstate, ActionTypes.ATTRIBUTES);
const useIndexed = common.useIndexed(Select.attributes.getSubstate, 'attributes', ActionTypes.ATTRIBUTES);
const useIndexedClear = common.useIndexedClear(ActionTypes.ATTRIBUTES);
const useKeys = common.useKeys(Select.attributes.getSubstate, 'attributes', ActionTypes.ATTRIBUTES);
const useKeysClear = common.useKeysClear(ActionTypes.ATTRIBUTES);

// ============ export ===========

export default {
	create,
	delete: deleteItem,

	refreshUses,

	saveEdited,

	updateEdited,
	useIndexed,
	useIndexedClear,
	useKeys,
	useKeysClear
}
