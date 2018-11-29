import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";

const getSubstate = state => state.themes;

const getActive = common.getActive(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);
const getAllForActiveScope = common.getAllForActiveScope(getSubstate);
const getAllForDataview = common.getAllForDataview(getSubstate);
const getAllForDataviewAsObject = common.getAllForDataviewAsObject(getSubstate);
const getByKey = common.getByKey(getSubstate);

export default {
	getActive,
	getActiveKey,
	getAll,
	getAllAsObject,
	getAllForActiveScope,
	getAllForDataview,
	getAllForDataviewAsObject,
	getByKey,
	getSubstate
};