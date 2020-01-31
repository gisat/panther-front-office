import {createSelector} from 'reselect';
import LpisCaseStatuses from "../../constants/LpisCaseStatuses";

import common from "../../../../state/_common/selectors";

const getSubstate = state => state.specific.lpisChangeCases;
const getActive = common.getActive(getSubstate);
const getIndexed = common.getIndexed(getSubstate);
const getByKey = common.getByKey(getSubstate);
const getDataByKey = common.getDataByKey(getSubstate);
const getEditedDataByKey = common.getEditedDataByKey(getSubstate);
const getUsedKeys = common.getUsedKeys(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);

const getNextCaseKey = createSelector([
	getAllAsObject,
		(state, key) => key,
	],
	(allCases, key) => {
		const allCasesKeys = Object.keys(allCases);
		const keyIndex = allCasesKeys.indexOf(key);
		const nextIndex = keyIndex + 1;
		const nextKey = allCasesKeys.length >= nextIndex ? allCasesKeys[nextIndex] : null;
		return nextKey;
	}
);

const getCaseStatus = createSelector([
		getDataByKey,
	],
	(caseData) => {
		return caseData && caseData.status ? LpisCaseStatuses[caseData.status.toUpperCase()].szifName : null;
	}
);

const getCaseChanges = createSelector([
		getByKey,
	],
	(caseObject) => {
		return caseObject.changes
	}
);

const getCaseSubmit = createSelector([
		getCaseChanges,
	],
	(caseChanges) => {
		const change = caseChanges && caseChanges.filter((change) => change.status.toUpperCase() === LpisCaseStatuses.CREATED.database);
		return change && change.length > 0 ? change[0] : null;
	}
);

const getCaseChange = createSelector([
		getCaseChanges,
	],
	(caseChanges) => {
		return caseChanges && caseChanges[caseChanges.length - 1];
	}
);

const getCaseEnd = createSelector([
		getCaseChanges,
	],
	(caseChanges) => {
		const change = caseChanges && caseChanges.filter((change) => change.status.toUpperCase() === LpisCaseStatuses.CLOSED.database);
		return change && change.length > 0 ? change[0] : null;
	}
);

export default {
	getActive,
	getDataByKey,
	getEditedDataByKey,
	getIndexed,
	getNextCaseKey,
	getSubstate,
	getCaseChanges,
	getCaseSubmit,
	getCaseChange,
	getCaseEnd,
	getCaseStatus,
};