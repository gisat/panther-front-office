import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";

const getSubstate = state => state.visualizations;

const getActive = common.getActive(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getAllForActiveTheme = common.getAllForActiveTheme(getSubstate);
const getAllForDataview = common.getAllForDataview(getSubstate);
const getAllForDataviewAsObject = common.getAllForDataviewAsObject(getSubstate);

const isInitializedForExt = common.isInitializedForExt(getSubstate);

export default {
	getActive,
	getActiveKey,
	getAllForActiveTheme,
	getAllForDataview,
	getAllForDataviewAsObject,
	isInitializedForExt,
	getSubstate
};