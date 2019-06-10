import {createSelector} from 'reselect';

import common from "../../../../state/_common/selectors";

const getSubstate = state => state.specific.configurations;

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);
const getActive = common.getActive(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getActiveKeys = common.getActiveKeys(getSubstate);
const getActiveModels = common.getActiveModels(getSubstate);

const getIndexes = common.getIndexes(getSubstate);


export default {
	getActive,
	getActiveKey,
	getActiveKeys,
	getActiveModels,
	getAllAsObject,
	getSubstate
};