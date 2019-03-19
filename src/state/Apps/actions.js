import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/actions';
import Select from "../Select";

// ============ creators ===========

const setActiveKey = common.setActiveKey(ActionTypes.APPS);
const setActiveKeys = common.setActiveKeys(ActionTypes.APPS);
const useKeys = common.useKeys(Select.apps.getSubstate, 'applications', ActionTypes.APPS, 'applications');
const useIndexed = common.useIndexed(Select.apps.getSubstate, 'applications', ActionTypes.APPS, 'applications');
const useIndexedClear = common.useIndexedClear(ActionTypes.APPS);
const refreshUses = common.refreshUses(Select.apps.getSubstate, `applications`, ActionTypes.APPS, 'applications');
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.apps.getSubstate, 'applications', ActionTypes.APPS, 'applications');

// ============ actions ===========



// ============ export ===========

export default {
	ensure: common.ensure.bind(this, Select.apps.getSubstate, 'applications', ActionTypes.APPS, 'applications'),
	ensureIndexesWithFilterByActive,
	refreshUses,
	setActiveKey,
	setActiveKeys,
	useIndexed,
	useIndexedClear,
	useKeys
}
