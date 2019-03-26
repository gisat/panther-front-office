import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

import common from '../_common/actions';

// ============ creators ===========

const setActiveKey = common.setActiveKey(ActionTypes.VIEWS);
const setActiveKeys = common.setActiveKeys(ActionTypes.VIEWS);
const create = common.create(Select.views.getSubstate, 'views', ActionTypes.VIEWS);
const deleteItem = common.delete(Select.views.getSubstate, 'views', ActionTypes.VIEWS);
const saveEdited = common.saveEdited(Select.views.getSubstate, 'views', ActionTypes.VIEWS);
const updateEdited = common.updateEdited(Select.views.getSubstate, ActionTypes.VIEWS);
const useKeys = common.useKeys(Select.views.getSubstate, 'views', ActionTypes.VIEWS);
const useKeysClear = common.useKeysClear(ActionTypes.VIEWS);
const useIndexedClear = common.useIndexedClear(ActionTypes.VIEWS);
const useIndexed = common.useIndexed(Select.views.getSubstate, 'views', ActionTypes.VIEWS);
const refreshUses = common.refreshUses(Select.views.getSubstate, `views`, ActionTypes.VIEWS);

function loadForKeys(keys){
	return (dispatch) => {
		let filter = {
			key: {
				in: keys
			}
		};
		return dispatch(common.loadFiltered('views', ActionTypes.VIEWS, filter));
	}
}

// ============ actions ===========

// ============ export ===========

export default {
	setActiveKey,
	setActiveKeys,
	create,
	delete: deleteItem,
	saveEdited,
	updateEdited,
	useKeys,
	useKeysClear,
	loadForKeys,
	refreshUses,
	useIndexed,
	useIndexedClear,
}
