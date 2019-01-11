import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";

const getSubstate = state => state.userGroups;

const getAll = common.getAll(getSubstate);

export default {
	getAll
};