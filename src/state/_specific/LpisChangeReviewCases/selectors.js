import {createSelector} from 'reselect';
import _ from 'lodash';
import Fuzzy from "fuzzy";
import fuzzysort from "fuzzysort";
import UsersSelectors from '../../Users/selectors';

import LpisCaseStatuses, {order as LpisCaseStatusOrder} from '../../../constants/LpisCaseStatuses';

const SEARCHABLE_CASE_KEYS = ['case_key', 'change_description'];
const SEARCHABLE_CASE_KEYS_SOURCES = ['data.case_key', 'data.change_description'];
const SEARCHING_RESULTS_LIMIT = 20;
const SEARCHING_SCORE_THRESHOLD = -10000;

const getCases = state => state.specific.lpisChangeReviewCases.cases;
const getChanges = state => state.specific.lpisChangeReviewCases.changes;
const getSearchString = state => state.specific.lpisChangeReviewCases.searchString;
const getSelectedStatuses = state => state.specific.lpisChangeReviewCases.selectedStatuses;
const getEditedCases = state => state.specific.lpisChangeReviewCases.editedCases;
const getActiveCaseKey = state => state.specific.lpisChangeReviewCases.activeCaseKey;
const getActiveEditedCaseKey = state => state.specific.lpisChangeReviewCases.activeNewEditedCaseKey;
const getNextActiveCaseKey = state => state.specific.lpisChangeReviewCases.nextActiveCaseKey;

const getActiveViewKey = state => state.dataviews.activeKey;

const getCasesWithChanges = createSelector(
	[getCases, getChanges],
	(cases, changes) => {
		let extendedCases = [];
		cases.map(caseItem => {
			let extendedCase = _.cloneDeep(caseItem);
			let caseChanges = _.filter(changes, change => change.data.lpis_case_id === caseItem.key);
			let orderedChanges = _.orderBy(caseChanges, [(change) => {
				return change.data.date
			}], ['desc']);
			extendedCase.changes = orderedChanges;
			let firstChange = orderedChanges[orderedChanges.length - 1];
			let latestChange = orderedChanges[0];
			if (latestChange) {
				extendedCase.createdBy = firstChange.data.changed_by;
				extendedCase.updatedBy = latestChange.data.changed_by;
				extendedCase.updated = latestChange.data.date;
				extendedCase.status = latestChange.data.status;
				extendedCases.push(extendedCase);
			}
		});
		return extendedCases;
	}
);

const getCasesWithChangesWithoutInvalid = createSelector(
	[getCasesWithChanges, (state) => UsersSelectors.getActiveUserDromasLpisChangeReviewGroup(state)],
	(cases, userGroup) => {
		if (userGroup === 'gisatUsers'){
			return _.filter(cases, (oneCase) => {return oneCase.status === "CREATED"});
		} else {
			return _.filter(cases, (oneCase) => {return oneCase.status !== "INVALID"});
		}
	}
);

const getCasesFilteredByStatuses = createSelector(
	[getCasesWithChanges, getSelectedStatuses],
	(cases, statuses) => {
		if (statuses){
			return _.filter(cases, (oneCase) => {return _.includes(statuses, oneCase.status)});
		} else {
			return [];
		}
	}
);

const getCasesFilteredByStatusesSortedByDate = createSelector(
	[getCasesFilteredByStatuses],
	(cases) => {
		return _.sortBy(cases, [
			(oneCase) => {
				return oneCase.data.submit_date;
			}
		])
	}
);

const getAllCasesSortedByStatusAndDate = createSelector(
	[getCasesWithChanges,
		(state, props) => {
			return props.activeUserDromasLpisChangeReviewGroup
		}],
	(cases, activeUserDromasLpisChangeReviewGroup) => {
		cases = _.filter(cases, (oneCase) => {
			return _.includes(_.flatten(LpisCaseStatusOrder[activeUserDromasLpisChangeReviewGroup]), oneCase.status);
		});

		return _.sortBy(cases, [
			(oneCase) => {
				let ret;
				_.forEach(LpisCaseStatusOrder[activeUserDromasLpisChangeReviewGroup], (record, index) => {
					if((_.isArray(record) && _.includes(record, oneCase.status)) || record === oneCase.status) {
						ret = index;
					}
				});
				return ret;
			},
			(oneCase) => {
				return oneCase.data.submit_date;
			}
		]);
	}
);

const getSearchingResultFromCasesWithoutInvalid = createSelector(
	[getSearchString, getCasesWithChangesWithoutInvalid],
	(searchString, cases) => {
		if (searchString && searchString.length > 0) {
			return search(searchString, cases);
		} else {
			return [];
		}
	}
);

const  getSearchingResultFromCasesWithSelectedStatuses = createSelector(
	[getSearchString, getCasesFilteredByStatuses],
	(searchString, cases) => {
		if (searchString && searchString.length > 0) {
			return search(searchString, cases);
		} else {
			return [];
		}
	}
);

const getActiveEditedCase = createSelector(
	[getActiveEditedCaseKey, getEditedCases],
	(activeEditedCaseKey, editedCases) => {
		return _.find(editedCases, {key: activeEditedCaseKey});
	}
);

const getActiveCase = createSelector(
	[getActiveCaseKey, getCasesWithChanges],
	(activeCaseKey, cases) => {
		return _.find(cases, {key: activeCaseKey});
	}
);

const getUserApprovedEvaluationOfActiveCase = createSelector(
	[getActiveCase, UsersSelectors.getAll],
	(activeCase, users) => {
		let latestApproval = activeCase ? _.find(activeCase.changes, (change) => {
			return change.data.status === LpisCaseStatuses.EVALUATION_APPROVED.database;
		}) : null;
		if (latestApproval){
			return _.find(users, {key: latestApproval.data.changed_by});
		}
		return null;
	}
);

const getUserCreatedActiveCase = createSelector(
	[getActiveCase, UsersSelectors.getAll],
	(activeCase, users) => {
		return activeCase ? _.find(users, {key: activeCase.createdBy}) : null;
	}
);

const getActiveCaseEdited = createSelector(
	[getActiveCaseKey, getEditedCases],
	(activeCaseKey, editedCases) => {
		return _.find(editedCases, {key: activeCaseKey});
	}
);

const getCaseByActiveView = createSelector(
	[getActiveViewKey, getCases],
	(activeViewKey, cases) => {
		return _.find(cases, (oneCase) => {
			return oneCase.data.view_id === activeViewKey;
		});
	}
);

/* auxiliary functions */
const search = function(searchString, cases){
	let results = fuzzysort.go(searchString, cases, {
		threshold: SEARCHING_SCORE_THRESHOLD,
		limit: SEARCHING_RESULTS_LIMIT,
		keys: SEARCHABLE_CASE_KEYS_SOURCES
	});

	let records = [];
	results.forEach(result => {
		let record = {...result.obj};
		result.forEach((rec, i) => {
			let highlighted = fuzzysort.highlight(rec, '<i>', '</i>');
			if (highlighted){
				record[SEARCHABLE_CASE_KEYS[i] + '_highlighted'] = highlighted;
			}
		});
		records.push(record);
	});

	return records;
};

export default {
	getCases: getCases,
	getCasesWithChanges: getCasesWithChanges,

	getCasesFilteredByStatusesSortedByDate: getCasesFilteredByStatusesSortedByDate,
	getSearchingResultFromCasesWithoutInvalid: getSearchingResultFromCasesWithoutInvalid,
	getSearchingResultFromCasesWithSelectedStatuses: getSearchingResultFromCasesWithSelectedStatuses,
	getAllCasesSortedByStatusAndDate: getAllCasesSortedByStatusAndDate,

	getChanges: getChanges,
	getSearchString: getSearchString,
	getSelectedStatuses: getSelectedStatuses,
	getActiveEditedCase: getActiveEditedCase,
	getActiveEditedCaseKey: getActiveEditedCaseKey,
	getEditedCases: getEditedCases,
	getActiveCaseKey: getActiveCaseKey,
	getActiveCase: getActiveCase,
	getActiveCaseEdited: getActiveCaseEdited,
	getUserApprovedEvaluationOfActiveCase: getUserApprovedEvaluationOfActiveCase,
	getUserCreatedActiveCase:  getUserCreatedActiveCase,
	getCaseByActiveView: getCaseByActiveView,
	getNextActiveCaseKey
};