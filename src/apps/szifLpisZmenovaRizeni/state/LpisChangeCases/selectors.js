import {createSelector} from 'reselect';

import common from "../../../../state/_common/selectors";

const getSubstate = state => state.specific.lpisChangeCases;
const getIndexed = common.getIndexed(getSubstate);
const getDataByKey = common.getDataByKey(getSubstate);
const getEditedDataByKey = common.getEditedDataByKey(getSubstate);
export default {
	getSubstate,
	getDataByKey,
	getEditedDataByKey,
	getIndexed
};