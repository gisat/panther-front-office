import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";

const getSubstate = state => state.periods;

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);
const getAllForDataview = common.getAllForDataview(getSubstate);
const getAllForDataviewAsObject = common.getAllForDataviewAsObject(getSubstate);
const getAllForIndexInUseByComponentId = common.getAllForIndexInUseByComponentId(getSubstate);
const getActive = common.getActive(getSubstate);
const getActiveKeys = common.getActiveKeys(getSubstate);
const getActiveModels = common.getActiveModels(getSubstate);

export default {
	getActivePeriod: getActive,
	getPeriods: getAll,
	getActiveKeys,
	getActiveModels,
	getAll,
	getAllAsObject,
	getAllForDataview,
	getAllForDataviewAsObject,
	getAllForIndexInUseByComponentId,
	getSubstate
};