import Action from '../Action';
import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========
const setActiveKey = common.setActiveKey(ActionTypes.VISUALIZATIONS);
const useKeys = common.useKeys(Select.visualizations.getSubstate, 'visualizations', ActionTypes.VISUALIZATIONS);
const useIndexed = common.useIndexed(Select.visualizations.getSubstate, 'visualizations', ActionTypes.VISUALIZATIONS);
const refreshUses = common.refreshUses(Select.visualizations.getSubstate, 'visualizations', ActionTypes.VISUALIZATIONS);

// ============ actions ===========

function actionClearUseIndexed(componentId) {
	return {
		type: ActionTypes.VISUALIZATIONS.USE.INDEXED.CLEAR,
		componentId
	}
}

// TODO It will be removed along with Ext
function actionInitializeForExt() {
	return {
		type: ActionTypes.VISUALIZATIONS.INITIALIZE_FOR_EXT,
	}
}

// ============ export ===========

export default {
	refreshUses,
	useIndexed,
	useIndexedClear: actionClearUseIndexed,
	useKeys,
	setActiveKey,

	initializeForExt: actionInitializeForExt
}
