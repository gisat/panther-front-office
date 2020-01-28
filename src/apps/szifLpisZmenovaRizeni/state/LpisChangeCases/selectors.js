import {createSelector} from 'reselect';

import common from "../../../../state/_common/selectors";

const getSubstate = state => state.specific.lpisChangeCases;
const getActive = common.getActive(getSubstate);
const getIndexed = common.getIndexed(getSubstate);
const getDataByKey = common.getDataByKey(getSubstate);
const getEditedDataByKey = common.getEditedDataByKey(getSubstate);
const getUsedKeys = common.getUsedKeys(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);

const getNextCaseKey = createSelector([
	getAllAsObject,
		(state, key) => key,
	],
	(allCases, key) => {
		console.log(allCases, key);
		const allCasesKeys = Object.keys(allCases);
		const keyIndex = allCasesKeys.indexOf(key);
		const nextIndex = keyIndex + 1;
		const nextKey = allCasesKeys.length >= nextIndex ? allCasesKeys[nextIndex] : null;
		return nextKey;
	}
);

export default {
	getActive,
	getDataByKey,
	getEditedDataByKey,
	getIndexed,
	getNextCaseKey,
	getSubstate,
};