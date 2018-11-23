import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";

const getSubstate = state => state.themes;

const getActive = common.getActive(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);
const getAllForDataview = common.getAllForDataview(getSubstate);
const getAllForDataviewAsObject = common.getAllForDataviewAsObject(getSubstate);
const getAllForIndexInUseByComponentId = common.getAllForIndexInUseByComponentId(getSubstate);
const getByKey = common.getByKey(getSubstate);

export default {
	getActive,
	getActiveKey,
	getAll,
	getAllAsObject,
	getAllForDataview,
	getAllForDataviewAsObject,
	getAllForIndexInUseByComponentId,
	getByKey,
	getSubstate
};