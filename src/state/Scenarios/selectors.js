import {createSelector} from 'reselect';
import _ from 'lodash';
import Select from '../Select';

const getActiveCaseKey = state => state.scenarios.cases.activeKey;
const getActiveKey = state => state.scenarios.activeKey;
const getActiveKeys = state => state.scenarios.activeKeys;
const getAll = state => state.scenarios;
const getCases = state => state.scenarios.cases.data;
const getCasesEdited = state => state.scenarios.cases.editedData;
const getCasesAll = state => state.scenarios.cases;
const getScenarios = state => state.scenarios.data;
const getScenariosEdited = state => state.scenarios.editedData;

const isDefaultSituationActive = state => state.scenarios.defaultSituationActive;

const getActivePlaceKey = state => state.places.activeKey;

const getScenarioEdited = (state, key) => {
	let edited = null;
	if (key){
		edited = _.find(state.scenarios.editedData, {key: key});
	}
	return edited;
};

const getScenariosEditedKeys = createSelector(
	[getScenariosEdited],
	editedScenarios => {
		return _.map(editedScenarios, 'key');
	}
);

const getActive = createSelector(
	[getScenarios, getActiveKey],
	(scenarios, activeKey) => {
		return _.find(scenarios, {key: activeKey});
	}
);

const getActivePlaceCases = createSelector(
	[getCases, getActivePlaceKey],
	(cases, activePlaceKey) => {
		if (cases.length && activePlaceKey){
			return _.filter(cases, (caseItem)=>{
				return _.find(caseItem.data.place_ids, (placeId) => {return placeId === activePlaceKey});
			});
		} else {
			return [];
		}
	}
);

const getActiveScenarios = createSelector(
	[getScenarios, getActiveKeys],
	(scenarios, activeKeys) => {
		let activeScenarios = [];
		if (activeKeys){
			activeKeys.map(activeKey => {
				let scenario = _.find(scenarios, {key: activeKey});
				if (scenario){
					activeScenarios.push(scenario);
				}
			});
		}
		return activeScenarios;
	}
);

const getActiveCase = createSelector(
	[getCases, getActiveCaseKey],
	(cases, activeKey) => {
		return _.find(cases, {key: activeKey});
	}
);

const getActiveCaseEdited = createSelector(
	[getCasesEdited, getActiveCaseKey],
	(cases, activeKey) => {
		return _.find(cases, {key: activeKey});
	}
);

const getActiveCaseScenarioKeys = createSelector(
	[getActiveCase],
	(activeCase) => {
		return (activeCase && activeCase.data) ? activeCase.data.scenarios : null;
	}
);

const getActiveCaseScenariosEditedKeys = createSelector(
	[getActiveCase, getScenariosEditedKeys],
	(activeCase, scenariosEditedKeys) => {
		return activeCase ? _.filter(activeCase.data.scenarios, key => {
			return _.includes(scenariosEditedKeys, key);
		}) : null;
	}
);

/**
 * It returns scenario keys from edited active case
 */
const getActiveCaseEditedScenarioKeys = createSelector(
	[getActiveCaseEdited],
	(activeCaseEdited) => {
		return (activeCaseEdited && activeCaseEdited.data) ? activeCaseEdited.data.scenarios : null;
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

const getActiveCaseScenariosEdited = createSelector(
	[getScenariosEdited, getActiveCaseScenarioKeys, getActiveCaseEditedScenarioKeys],
	(scenariosEdited, activeCaseScenarioKeys, activeCaseEditedScenarioKeys) => {
		if (scenariosEdited && activeCaseScenarioKeys){
			let keys = activeCaseEditedScenarioKeys ? [...activeCaseScenarioKeys, ...activeCaseEditedScenarioKeys] : activeCaseScenarioKeys;
			return _.filter(scenariosEdited, (scenario) => {
				return _.find(keys, (key) => {
					return key === scenario.key;
				});
			});
		} else {
			return null;
		}
	}
);

const getCase = (state, key) => {
	let caseData = null;
	if (key && state.scenarios.cases && state.scenarios.cases.data){
		caseData = _.find(state.scenarios.cases.data, {key: key});
	}
	return caseData;
};

const getScenario = (state, key) => {
	let scenario = null;
	if (key){
		scenario = _.find(state.scenarios.data, {key: key});
	}
	return scenario;
};

const activeCaseScenariosLoaded = createSelector(
	[getActiveCase],
	(activeCase) => {
		return activeCase ? activeCase.scenariosLoaded : false;
	});


export default {
	activeCaseScenariosLoaded: activeCaseScenariosLoaded,
	getActive: getActive,
	getActiveCase: getActiveCase,
	getActiveCaseEdited: getActiveCaseEdited,
	getActiveCaseEditedScenarioKeys: getActiveCaseEditedScenarioKeys,
	getActiveCaseKey: getActiveCaseKey,
	getActiveCaseScenarioKeys: getActiveCaseScenarioKeys,
	getActiveCaseScenarios: getActiveCaseScenarios,
	getActiveCaseScenariosEdited: getActiveCaseScenariosEdited,
	getActiveKey: getActiveKey,
	getActiveKeys: getActiveKeys,
	getActivePlaceCases: getActivePlaceCases,
	getActiveScenarios: getActiveScenarios,
	getAll: getAll,
	getCase: getCase,
	getCases: getCases,
	getCasesAll: getCasesAll,
	getCasesEdited: getCasesEdited,
	getScenario: getScenario,
	getScenarioEdited: getScenarioEdited,
	getScenariosEdited: getScenariosEdited,
	getScenariosEditedKeys: getScenariosEditedKeys,
	getActiveCaseScenariosEditedKeys: getActiveCaseScenariosEditedKeys,
	isDefaultSituationActive: isDefaultSituationActive
};