import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";

const getSubstate = (state) => state.attributeStatistics;
const getAllAsObject = common.getAllAsObject(getSubstate);
const getBatchByFilterOrder = common.getBatchByFilterOrder(getSubstate);

export default {
	getSubstate,
	getAllAsObject,
	getBatchByFilterOrder,
};