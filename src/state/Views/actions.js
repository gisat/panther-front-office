import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import common from '../_common/actions';

// ============ creators ===========

const setActiveKey = common.setActiveKey(ActionTypes.VIEWS);
const setActiveKeys = common.setActiveKeys(ActionTypes.VIEWS);
const create = common.create(Select.views.getSubstate, 'views', ActionTypes.VIEWS, 'views');
const deleteItem = common.delete(Select.views.getSubstate, 'views', ActionTypes.VIEWS, 'views');
const saveEdited = common.saveEdited(Select.views.getSubstate, 'views', ActionTypes.VIEWS, 'views');
const updateEdited = common.updateEdited(Select.views.getSubstate, ActionTypes.VIEWS, 'views');
const useKeys = common.useKeys(Select.views.getSubstate, 'views', ActionTypes.VIEWS, 'views');
const useKeysClear = common.useKeysClear(ActionTypes.VIEWS);
const useIndexedClear = common.useIndexedClear(ActionTypes.VIEWS);
const useIndexed = common.useIndexed(Select.views.getSubstate, 'views', ActionTypes.VIEWS, 'views');
const refreshUses = common.refreshUses(Select.views.getSubstate, `views`, ActionTypes.VIEWS, 'views');
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.views.getSubstate, 'views', ActionTypes.VIEWS, 'views');

// ============ actions ===========

// ============ export ===========

export default {
	setActiveKey,
	setActiveKeys,
	create,
	delete: deleteItem,
	ensureIndexesWithFilterByActive,
	saveEdited,
	updateEdited,
	useKeys,
	useKeysClear,
	refreshUses,
	useIndexed,
	useIndexedClear,
}
