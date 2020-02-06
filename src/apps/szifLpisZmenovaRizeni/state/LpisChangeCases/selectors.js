import {createSelector} from 'reselect';
import LpisCaseStatuses from "../../constants/LpisCaseStatuses";
import lpisZmenovaRizeniSelectors from "../LpisZmenovaRizeni/selectors";

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
	lpisZmenovaRizeniSelectors.getActiveUserGroups,
	(state, key) => key,
	],
	(allCases, userGroups, key) => {
		const allCasesKeys = Object.keys(allCases);
		const keyIndex = allCasesKeys.indexOf(key);
		let nextIndex = keyIndex + 1;
		let nextKey = allCasesKeys.length >= nextIndex ? allCasesKeys[nextIndex] : null;
		while (nextIndex && nextKey) {
			//check permissions
			const nextCase = allCases[nextKey];
			const nextCaseStatus = nextCase.data.status;
			const hasCreatedStatus = nextCaseStatus === LpisCaseStatuses.CREATED.database || nextCaseStatus === LpisCaseStatuses.EVALUATION_CREATED.database;
			const isGisat = userGroups && (userGroups.includes('gisatUsers') || userGroups.includes('gisatAdmins'));

			if ( !hasCreatedStatus || isGisat) {
				return nextKey;
			} else {
				nextIndex = nextIndex + 1;
				nextKey = allCasesKeys.length >= nextIndex ? allCasesKeys[nextIndex] : null;
			}
		}
		return null;
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
		if(caseObject) {
			return caseObject.changes
		} else {
			return null;
		}
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

const getCaseEvaluationApproved = createSelector([
		getCaseChanges,
	],
	(caseChanges) => {
		const change = caseChanges && caseChanges.filter((change) => change.status.toUpperCase() === LpisCaseStatuses.EVALUATION_APPROVED.database);
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
	getCaseEvaluationApproved,
	getCaseChange,
	getCaseEnd,
	getCaseStatus,
};