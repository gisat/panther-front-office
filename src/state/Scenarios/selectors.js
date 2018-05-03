import {createSelector} from 'reselect';
import _ from 'lodash';

const getActiveCaseKey = state => state.scenarios.cases.activeKey;
const getActiveKey = state => state.scenarios.activeKey;
const getActiveKeys = state => state.scenarios.activeKeys;
const getAll = state => state.scenarios;
const getCases = state => state.scenarios.cases.data;
const getScenarios = state => state.scenarios.data;
const isDefaultSituationActive = state => state.scenarios.defaultSituationActive;

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

const getActiveCaseScenarioKeys = createSelector(
	[getActiveCase],
	(activeCase) => {
		return activeCase ? activeCase.scenarios : null;
	}
);

const getActiveCaseScenarios = createSelector(
	[getScenarios, getActiveCaseScenarioKeys],
	(scenarios, activeCaseScenarioKeys) => {
		if (activeCaseScenarioKeys){
			return _.filter(scenarios, (scenario) => {
				return _.find(activeCaseScenarioKeys, (key) => {
					return key === scenario.key;
				});
			});
		} else {
			return null;
		}
	}
);

export default {
	getActive: getActive,
	getActiveCase: getActiveCase,
	getActiveCaseKey: getActiveCaseKey,
	getActiveCaseScenarioKeys: getActiveCaseScenarioKeys,
	getActiveCaseScenarios: getActiveCaseScenarios,
	getActiveKey: getActiveKey,
	getActiveKeys: getActiveKeys,
	getAll: getAll,
	getCases: getCases,
	isDefaultSituationActive: isDefaultSituationActive
};