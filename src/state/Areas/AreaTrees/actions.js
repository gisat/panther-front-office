import ActionTypes from '../../../constants/ActionTypes';

import common from '../../_common/actions';
import Select from "../../Select";


// ============ creators ===========

const setActiveKey = common.setActiveKey(ActionTypes.AREAS.AREA_TREES);
const useIndexed = common.useIndexed(Select.areas.areaTrees.getSubstate, 'areaTrees', ActionTypes.AREAS.AREA_TREES);
const useKeys = common.useKeys(Select.areas.areaTrees.getSubstate, 'areaTrees', ActionTypes.AREAS.AREA_TREES);
const refreshUses = common.refreshUses(Select.areas.areaTrees.getSubstate, `areaTrees`, ActionTypes.AREAS.AREA_TREES);
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.areas.areaTrees.getSubstate, 'areaTrees', ActionTypes.AREAS.AREA_TREES);

// ============ actions ===========

function actionClearUseIndexed(componentId) {
	return {
		type: ActionTypes.AREAS.AREA_TREES.USE.INDEXED.CLEAR,
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
	useKeys,
	useKeysClear: common.useKeysClear(ActionTypes.AREAS.AREA_TREES)
}

