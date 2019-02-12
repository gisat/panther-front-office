import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";

const getSubstate = state => state.layerTemplates;

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);
const getByKey = common.getByKey(getSubstate);
const getDataByKey = common.getDataByKey(getSubstate);

export default {
	getAll,
	getAllAsObject,
	getByKey,
	getDataByKey,
	getSubstate
};