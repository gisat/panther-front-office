import {createSelector} from 'reselect';
import _ from 'lodash';
import FuzzySearch from "fuzzy-search";

import LpisCaseStatuses, {order as LpisCaseStatusOrder} from '../../constants/LpisCaseStatuses';

const getCases = state => state.lpisCases.cases;
const getChanges = state => state.lpisCases.changes;
const getSearchString = state => state.lpisCases.searchString;
const getSelectedStatuses = state => state.lpisCases.selectedStatuses;
const getEditedCases = state => state.lpisCases.editedCases;
const getActiveCaseKey = state => state.lpisCases.activeCaseKey;
const getActiveEditedCaseKey = state => state.lpisCases.activeNewEditedCaseKey;
const getNextActiveCaseKey = state => state.lpisCases.nextActiveCaseKey;

const getActiveViewKey = state => state.views.activeKey;

const getCasesWithChanges = createSelector(
	[getCases, getChanges],
	(cases, changes) => {
		let extendedCases = [];
		cases.map(caseItem => {
			let extendedCase = _.cloneDeep(caseItem);
			extendedCase.changes = _.filter(changes, change => change.data.lpis_case_id === caseItem.key);
			let latestChange = _.orderBy(extendedCase.changes, [(change) => {
				return change.data.date
			}], ['desc'])[0];
			if (latestChange) {
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
	[getCasesWithChanges],
	(cases) => {
		return _.filter(cases, (oneCase) => {return oneCase.status !== "INVALID"});
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
			let searcher = new FuzzySearch(cases, ['data.case_key', 'data.change_description'], {sort: true});
			return searcher.search(searchString);
		} else {
			return [];
		}
	}
);

const  getSearchingResultFromCasesWithSelectedStatuses = createSelector(
	[getSearchString, getCasesFilteredByStatuses],
	(searchString, cases) => {
		if (searchString && searchString.length > 0) {
			let searcher = new FuzzySearch(cases, ['data.case_key', 'data.change_description'], {sort: true});
			return searcher.search(searchString);
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
	getCaseByActiveView: getCaseByActiveView,
	getNextActiveCaseKey
};