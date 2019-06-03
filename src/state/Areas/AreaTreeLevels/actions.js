import ActionTypes from '../../../constants/ActionTypes';

import common from '../../_common/actions';
import Select from "../../Select";


// ============ creators ===========

const setActiveKey = common.setActiveKey(ActionTypes.AREAS.AREA_TREE_LEVELS);
const useIndexed = common.useIndexed(Select.areas.areaTrees.getSubstate, 'areatreelevels', ActionTypes.AREAS.AREA_TREE_LEVELS);
const useKeys = common.useKeys(Select.areas.areaTrees.getSubstate, 'areatreelevels', ActionTypes.AREAS.AREA_TREE_LEVELS);
const refreshUses = common.refreshUses(Select.areas.areaTrees.getSubstate, `areatreelevels`, ActionTypes.AREAS.AREA_TREE_LEVELS);
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.areas.areaTrees.getSubstate, 'areatreelevels', ActionTypes.AREAS.AREA_TREE_LEVELS);

// ============ actions ===========

function actionClearUseIndexed(componentId) {
	return {
		type: ActionTypes.AREAS.AREA_TREE_LEVELS.USE.INDEXED.CLEAR,
		componentId
	}
}

// ============ export ===========

export default {
	ensureIndexesWithFilterByActive,
	refreshUses,
	setActiveKey,
	useIndexed,
	useIndexedClear: actionClearUseIndexed,
	useKeys
}

