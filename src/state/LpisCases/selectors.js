import {createSelector} from 'reselect';
import _ from 'lodash';

const getCases = state => state.lpisCases.cases.data;
const getChanges = state => state.lpisCases.changes;

const getCasesWithChanges = createSelector(
	[getCases, getChanges],
	(cases, changes) => {
		let extendedCases = [];
		cases.map(caseItem => {
			let extendedCase = _.cloneDeep(caseItem);
			extendedCase.changes = _.filter(changes, change => change.data.lpis_case_id === caseItem.key);
			let latestChange = _.orderBy(extendedCase.changes, [(change) => {return change.data.changed}], ['desc'])[0];
			extendedCase.updated = latestChange.data.changed;
			extendedCase.status = latestChange.data.status;
			extendedCases.push(extendedCase);
		});
		return extendedCases;
	}
);

export default {
	getCases: getCases,
	getChanges: getChanges,
	getCasesWithChanges: getCasesWithChanges
};