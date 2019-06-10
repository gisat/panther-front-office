import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../../../../state/_common/actions';
import Select from "../../state/Select";

// ============ creators ===========

const setActiveKey = common.setActiveKey(ActionTypes.CONFIGURATIONS);
const setActiveKeys = common.setActiveKeys(ActionTypes.CONFIGURATIONS);
const useKeys = common.useKeys(Select.specific.configurations.getSubstate, 'configurations', ActionTypes.CONFIGURATIONS, 'applications');
const useIndexed = common.useIndexed(Select.specific.configurations.getSubstate, 'configurations', ActionTypes.CONFIGURATIONS, 'applications');
const useIndexedClear = common.useIndexedClear(ActionTypes.CONFIGURATIONS);
const refreshUses = common.refreshUses(Select.specific.configurations.getSubstate, `configurations`, ActionTypes.CONFIGURATIONS, 'applications');
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.specific.configurations.getSubstate, 'applications', ActionTypes.CONFIGURATIONS, 'applications');
const setActiveKeyAndEnsureDependencies = common.setActiveKey(ActionTypes.CONFIGURATIONS);

// ============ actions ===========

const setManaged = (key) => {
	return {
		type: ActionTypes.CONFIGURATIONS.SET_MANAGED,
		key: key
	}
};

// ============ export ===========

export default {
	ensure: common.ensure.bind(this, Select.specific.configurations.getSubstate, 'configurations', ActionTypes.CONFIGURATIONS, 'applications'),
	ensureIndexesWithFilterByActive,
	refreshUses,
	setActiveKey,
	setActiveKeyAndEnsureDependencies,
	setActiveKeys,
	setManaged,
	useIndexed,
	useIndexedClear,
	useKeys
}
