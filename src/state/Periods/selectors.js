import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";

const getSubstate = state => state.periods;

const getAll = common.getAll(getSubstate);
const getActive = common.getActive(getSubstate);

export default {
	getActivePeriod: getActive,
	getPeriods: getAll
};