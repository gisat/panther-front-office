import {createSelector} from 'reselect';
import _ from 'lodash';
import fuzzysort from "fuzzysort";

const SEARCHABLE_CASE_KEYS = ['case_key', 'change_description'];
const SEARCHABLE_CASE_KEYS_SOURCES = ['data.poznamka', 'data.nkod_dpb'];
const SEARCHING_RESULTS_LIMIT = 20;
const SEARCHING_SCORE_THRESHOLD = -10000;

const getCases = state => state.specific.lpisCheckCases.cases;
const getFilterVisited = state => state.specific.lpisCheckCases.filterVisited;
const getFilterConfirmed = state => state.specific.lpisCheckCases.filterConfirmed;
const getFilterSearch = state => state.specific.lpisCheckCases.searchString;
const getChanges = state => state.specific.lpisCheckCases.changes;
const getSearchString = state => state.specific.lpisCheckCases.searchString;
const getActiveCaseKey = state => state.specific.lpisCheckCases.activeCaseKey;
const getActiveViewKey = state => state.dataviews.activeKey;
const getSubstate = state => state.specific.lpisCheckCases;
const getChangingCase = state => state.specific.lpisCheckCases.changingActive;

const getFilterParams = state => ({
	filterVisited: getFilterVisited(state),
	filterConfirmed: getFilterConfirmed(state),
	filterSearch: getFilterSearch(state),
});

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

const filterCasesByVisited = (cases, visited) => {
	let conditions = null;
	switch (visited) {
		case 'all':
			return cases;
		case 'unvisited':
			conditions = [false, null];
			break;
		case 'visited':
			conditions = true;
			break;
	}
	
	const filter = (cases, condition) => cases.filter((lpisCase) => lpisCase.data.visited === condition);
	return filterByConditions(cases, conditions, filter);
}

const filterCasesByConfirmed = (cases, confirmed) => {
	let conditions = null;
	switch (confirmed) {
		case 'all':
			return cases;
		case 'denied':
			conditions = [false, null];
			break;
		case 'confirmed':
			conditions = true;
			break;
	}
	const filter = (cases, condition) => cases.filter((lpisCase) => lpisCase.data.confirmed === condition);
	return filterByConditions(cases, conditions, filter);
}

const getFilteredCases = createSelector(
	[getCases, getFilterParams, getSearchString],
	(cases, filterParams, searchString) => {
		//TODO - better filter and union?
		const filteredByVisited = filterCasesByVisited(cases, filterParams.filterVisited);
		const filteredByConfirmed = filterCasesByConfirmed(filteredByVisited, filterParams.filterConfirmed);
		if(searchString) {
			return search(searchString, filteredByConfirmed);
		} else {
			return filteredByConfirmed;
		}
	}
);

const getActiveCase = createSelector(
	[getActiveCaseKey, getCases],
	(activeCaseKey, cases) => {
		return _.find(cases, {key: activeCaseKey});
	}
);

//get filtered
const _getActiveCaseIndex = createSelector(
	[getActiveCaseKey, getFilteredCases],
	(activeCaseKey, cases) => {
		return cases.findIndex((c) => {
			return c.key === activeCaseKey
		});
	}
);

const getPreviousCaseKey = createSelector(
	[_getActiveCaseIndex, getFilteredCases],
	(activeCaseIndex, cases) => {
		const previousCase = cases[activeCaseIndex - 1]
		if(previousCase) {
			return previousCase.key
		} else {
			return null;
		}
	}
);

const getNextCaseKey = createSelector(
	[_getActiveCaseIndex, getFilteredCases],
	(activeCaseIndex, cases) => {
		const nextCase = cases[activeCaseIndex + 1]
		if(nextCase) {
			return nextCase.key
		} else {
			return null;
		}
	}
);

const getCaseByActiveView = createSelector(
	[getActiveViewKey, getCases],
	(activeViewKey, cases) => {
		return cases.find(oneCase => parseInt(oneCase.data.dataview_key) === parseInt(activeViewKey));
	}
);

// /* auxiliary functions */
const search = (searchString, cases) => {
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


const filterByConditions = (items, conditions, filter) => {
	if (Array.isArray(conditions)) {
		return conditions.reduce((accumulation, condition) => {
			return [...accumulation, ...filter(items, condition)]
		}, [])
	} else {
		return filter(items, conditions);
	}
}

export default {
	getCases,
	getChangingCase,
	getSubstate,
	getFilterVisited,
	getFilterConfirmed,
	getFilterSearch,
	getFilteredCases,
	getCasesWithChanges,
	getActiveCaseKey,
	getActiveCase,
	getNextCaseKey,
	getPreviousCaseKey,
	getCaseByActiveView,
};