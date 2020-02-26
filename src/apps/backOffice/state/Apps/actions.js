import ActionTypes from '../../constants/ActionTypes';
import {commonActions as common} from '@gisatcz/ptr-state';
import Select from "../../state/Select";

// ============ creators ===========

const setActiveKey = common.setActiveKey(ActionTypes.APPS);
const setActiveKeys = common.setActiveKeys(ActionTypes.APPS);
const useKeys = common.useKeys(Select.specific.apps.getSubstate, 'applications', ActionTypes.APPS, 'applications');
const useIndexed = common.useIndexed(Select.specific.apps.getSubstate, 'applications', ActionTypes.APPS, 'applications');
const useIndexedClear = common.useIndexedClear(ActionTypes.APPS);
const refreshUses = common.refreshUses(Select.specific.apps.getSubstate, `applications`, ActionTypes.APPS, 'applications');
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.specific.apps.getSubstate, 'applications', ActionTypes.APPS, 'applications');
const setActiveKeyAndEnsureDependencies = common.setActiveKeyAndEnsureDependencies(ActionTypes.APPS, 'application');

// ============ actions ===========

const setManaged = (key) => {
	return {
		type: ActionTypes.APPS.SET_MANAGED,
		key: key
	}
};

// ============ export ===========

export default {
	ensure: common.ensure.bind(this, Select.specific.apps.getSubstate, 'applications', ActionTypes.APPS, 'applications'),
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
