import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";

const getSubstate = state => state.visualizations;

const getAllForDataview = common.getAllForDataview(getSubstate);
const getAllForDataviewAsObject = common.getAllForDataviewAsObject(getSubstate);

const isInitializedForExt = common.isInitializedForExt(getSubstate);

export default {
	getAllForDataview,
	getAllForDataviewAsObject,
	isInitializedForExt,
	getSubstate
};