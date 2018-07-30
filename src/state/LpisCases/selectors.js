import {createSelector} from 'reselect';
import _ from 'lodash';
import FuzzySearch from "fuzzy-search";

const getCases = state => state.lpisCases.cases;
const getChanges = state => state.lpisCases.changes;
const getSearchString = state => state.lpisCases.searchString;
const getActiveNewEditedCaseKey = state => state.lpisCases.activeNewEditedCaseKey;
const getEditedCases = state => state.lpisCases.editedCases;
const getActiveEditedCaseKey = state => state.lpisCases.activeNewEditedCaseKey;

const getCasesWithChanges = createSelector(
	[getCases, getChanges],
	(cases, changes) => {
		let extendedCases = [];
		cases.map(caseItem => {
			let extendedCase = _.cloneDeep(caseItem);
			extendedCase.changes = _.filter(changes, change => change.data.lpis_case_id === caseItem.key);
			let latestChange = _.orderBy(extendedCase.changes, [(change) => {return change.data.date}], ['desc'])[0];
			if(latestChange) {
				extendedCase.updated = latestChange.data.date;
				extendedCase.status = latestChange.data.status;
				extendedCases.push(extendedCase);
			}
		});
		return extendedCases;
	}
);

const getSearchResults = createSelector(
	[getSearchString, getCasesWithChanges],
	(searchString, casesWithChanges) => {
		if (searchString && searchString.length > 0){
			let searcher = new FuzzySearch(casesWithChanges, ['data.code_dpb', 'data.change_description_place']);
			return searcher.search(searchString);
		} else {
			return casesWithChanges;
		}
	}
);

const getActiveNewEditedCase = createSelector(
	[getActiveNewEditedCaseKey, getEditedCases],
	(activeNewEditedCaseKey, editedCases) => {
		return _.find(editedCases, {key: activeNewEditedCaseKey});
	}
);

export default {
	getCases: getCases,
	getChanges: getChanges,
	getCasesWithChanges: getCasesWithChanges,
	getSearchResults: getSearchResults,
	getSearchString: getSearchString,
	getActiveNewEditedCase: getActiveNewEditedCase,
	getActiveEditedCaseKey: getActiveEditedCaseKey,
	getEditedCases: getEditedCases
};