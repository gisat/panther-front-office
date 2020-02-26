import {createSelector} from 'reselect';

import {commonSelectors as common} from '@gisatcz/ptr-state';

const getSubstate = state => state.specific.apps;

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);
const getActive = common.getActive(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getActiveKeys = common.getActiveKeys(getSubstate);
const getActiveModels = common.getActiveModels(getSubstate);

const getIndexes = common.getIndexes(getSubstate);

// TODO test
const getActiveOrAll = createSelector(
	[
		getAll,
		getActive
	],
	(all, active) => {
		if (active) {
			return [active];
		} else if (all) {
			return all;
		} else {
			return null;
		}
	}
);

export default {
	getActive,
	getActiveKey,
	getActiveKeys,
	getActiveModels,
	getActiveOrAll,
	getAllAsObject,
	getSubstate
};