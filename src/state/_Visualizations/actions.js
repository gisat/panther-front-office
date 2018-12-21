import Action from '../Action';
import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========
const setActiveKey = common.setActiveKey(ActionTypes.VISUALIZATIONS);
const useKeys = common.useKeys(Select.visualizations.getSubstate, 'visualizations', ActionTypes.VISUALIZATIONS);
const useIndexed = common.useIndexed(Select.visualizations.getSubstate, 'visualizations', ActionTypes.VISUALIZATIONS);
const refreshAllIndexes = common.refreshAllIndexes(Select.visualizations.getSubstate, 'visualizations', ActionTypes.VISUALIZATIONS);

// ============ actions ===========


// ============ export ===========

export default {
	refreshAllIndexes,
	useIndexed,
	useKeys,
	setActiveKey
}
