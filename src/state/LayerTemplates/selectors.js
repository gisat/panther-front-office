import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";

const getSubstate = state => state.layerTemplates;

const getAll = common.getAll(getSubstate);
const getByKey = common.getByKey(getSubstate);

export default {
	getAll,
	getByKey,
	getSubstate
};