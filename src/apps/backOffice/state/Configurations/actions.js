import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import {commonActions as common} from '@gisatcz/ptr-state';
import Select from "../../state/Select";

// ============ creators ===========

const setActiveKey = common.setActiveKey(ActionTypes.CONFIGURATIONS);
const setActiveKeys = common.setActiveKeys(ActionTypes.CONFIGURATIONS);
const useKeys = common.useKeys(Select.specific.configurations.getSubstate, 'configurations', ActionTypes.CONFIGURATIONS, 'applications');
const useKeysClear = common.useKeysClear(ActionTypes.CONFIGURATIONS);
const useIndexed = common.useIndexed(Select.specific.configurations.getSubstate, 'configurations', ActionTypes.CONFIGURATIONS, 'applications');
const useIndexedClear = common.useIndexedClear(ActionTypes.CONFIGURATIONS);
const refreshUses = common.refreshUses(Select.specific.configurations.getSubstate, `configurations`, ActionTypes.CONFIGURATIONS, 'applications');
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.specific.configurations.getSubstate, 'applications', ActionTypes.CONFIGURATIONS, 'applications');
const setActiveKeyAndEnsureDependencies = common.setActiveKey(ActionTypes.CONFIGURATIONS);

const create = common.create(Select.specific.configurations.getSubstate, 'configurations', ActionTypes.CONFIGURATIONS, 'applications');
const deleteItem = common.delete(Select.specific.configurations.getSubstate, 'configurations', ActionTypes.CONFIGURATIONS, 'applications');
const saveEdited = common.saveEdited(Select.specific.configurations.getSubstate, 'configurations', ActionTypes.CONFIGURATIONS, 'applications');
const updateEdited = common.updateEdited(Select.specific.configurations.getSubstate, ActionTypes.CONFIGURATIONS);

// ============ actions ===========



// ============ export ===========

export default {
	create,
	deleteItem,
	delete: deleteItem,
	ensure: common.ensure.bind(this, Select.specific.configurations.getSubstate, 'configurations', ActionTypes.CONFIGURATIONS, 'applications'),
	ensureIndexesWithFilterByActive,
	refreshUses,
	saveEdited,
	setActiveKey,
	setActiveKeyAndEnsureDependencies,
	setActiveKeys,
	updateEdited,
	useIndexed,
	useIndexedClear,
	useKeys,
	useKeysClear
}
