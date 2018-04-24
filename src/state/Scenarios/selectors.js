import {createSelector} from 'reselect';
import _ from 'lodash';

const getActiveCaseKey = state => state.scenarios.cases.activeKey;
const getActiveKey = state => state.scenarios.activeKey;
const getCases = state => state.scenarios.cases.data;
const getScenarios = state => state.scenarios.data;

const getActive = createSelector(
	[getScenarios, getActiveKey],
	(scenarios, activeKey) => {
		return _.find(scenarios, {key: activeKey});
	}
);

const getActiveCase = createSelector(
	[getCases, getActiveCaseKey],
	(cases, activeKey) => {
		return _.find(cases, {key: activeKey});
	}
);

export default {
	getActive: getActive,
	getActiveCase: getActiveCase,
	getActiveCaseKey: getActiveCaseKey,
	getActiveKey: getActiveKey,
	getCases: getCases,
};