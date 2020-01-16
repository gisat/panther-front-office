import {createSelector} from 'reselect';

import common from "../../../../state/_common/selectors";

const getSubstate = state => state.specific.lpisChangeCases;
const getActive = common.getActive(getSubstate);
const getIndexed = common.getIndexed(getSubstate);

export default {
	getSubstate,
	getActive,

	getIndexed
};