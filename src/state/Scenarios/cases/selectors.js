import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../../_common/selectors";

import PlacesSelectors from "../../Places/selectors";
import ScenariosSelectors from "../../Scenarios/scenarios/selectors";

const getSubstate = state => state.scenarios.cases;

const getAll = common.getAll(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getActive = common.getActive(getSubstate);
const getByKey = common.getByKey(getSubstate);
const getEditedAll = common.getEditedAll(getSubstate);
const getEditedActive = common.getEditedActive(getSubstate);

const activeCaseScenariosLoaded = createSelector(
	[getActive],
	(activeCase) => {
		return activeCase && activeCase.data && activeCase.data.scenariosLoaded ? activeCase.data.scenariosLoaded : false;
	}
);

/**
 * It should select scenario keys of active case from byKey
 */
const getActiveCaseScenarioKeys = createSelector(
	[getActive],
	(activeCase) => {
		return (activeCase && activeCase.data && activeCase.data.scenarios) ? activeCase.data.scenarios : null;
	}
);

/**
 * It should select scenario keys of active case from editedByKey
 */
const getActiveCaseEditedScenarioKeys = createSelector(
	[getEditedActive],
	(activeCaseEdited) => {
		return (activeCaseEdited && activeCaseEdited.data && activeCaseEdited.data.scenarios) ? activeCaseEdited.data.scenarios : null;
	}
);

/**
 * It should select scenario models for active case
 */
const getActiveCaseScenarios = createSelector(
	[ScenariosSelectors.getAllAsObject, getActiveCaseScenarioKeys],
	(scenarios, activeCaseScenarioKeys) => {
		if (scenarios && !_.isEmpty(scenarios) && activeCaseScenarioKeys){
			let selectedModels = _.pick(scenarios, activeCaseScenarioKeys);
			return selectedModels && !_.isEmpty(selectedModels) ? Object.values(selectedModels) : null;
		} else {
			return null;
		}
	}
);

/**
 * It should select keys of edited scenarios for active case
 */
const getActiveCaseScenariosEditedKeys = createSelector(
	[getActive, ScenariosSelectors.getEditedKeys],
	(activeCase, scenariosEditedKeys) => {
		if (activeCase && activeCase.data && activeCase.data.scenarios && scenariosEditedKeys){
			let commonKeys = _.intersection(activeCase.data.scenarios, scenariosEditedKeys);
			return commonKeys && commonKeys.length ? commonKeys : null;
		} else {
			return null;
		}
	}
);

/**
 * It should select edited scenarios data for active case
 */
const getActiveCaseScenariosEdited = createSelector(
	[ScenariosSelectors.getEditedAllAsObject, getActiveCaseScenarioKeys, getActiveCaseEditedScenarioKeys],
	(scenariosEdited, activeCaseScenarioKeys, activeCaseEditedScenarioKeys) => {
		if (scenariosEdited && !_.isEmpty(scenariosEdited)){
			let keys = [];
			if (activeCaseScenarioKeys && activeCaseEditedScenarioKeys){
				keys = [...activeCaseScenarioKeys, ...activeCaseEditedScenarioKeys];
			} else if (activeCaseScenarioKeys && !activeCaseEditedScenarioKeys){
				keys = activeCaseScenarioKeys;
			} else if (!activeCaseScenarioKeys && activeCaseEditedScenarioKeys){
				keys = activeCaseEditedScenarioKeys;
			}

			let selectedEditedModels = _.pick(scenariosEdited, keys);
			return selectedEditedModels && !_.isEmpty(selectedEditedModels) ? Object.values(selectedEditedModels) : null;
		} else {
			return null;
		}
	}
);

/**
 * It should select first edited scenario for active case
 * TODO clarify usage
 */
const getActiveCaseScenarioEdited = createSelector(
	[getActiveCaseScenariosEdited],
	(scenariosEdited) => {
		if (scenariosEdited && scenariosEdited.length === 1){
			return scenariosEdited[0];
		} else {
			return null;
		}
	}
);

/**
 * Select all cases for active place
 */
const getActivePlaceCases = createSelector(
	[getAll, PlacesSelectors.getActiveKey],
	(cases, activePlaceKey) => {
		if (cases && cases.length && activePlaceKey){
			return _.filter(cases, (caseItem) => {
				return _.includes(caseItem.data.place_ids, activePlaceKey);
			});
		} else {
			return [];
		}
	}
);

export default {
	getActive,
	getActiveKey,
	getAll,
	getByKey,
	getEditedAll,

	activeCaseScenariosLoaded,
	getActiveCaseEdited: getEditedActive,
	getActiveCaseEditedScenarioKeys,
	getActiveCaseScenarioKeys,
	getActiveCaseScenarioEdited,
	getActiveCaseScenarios,
	getActiveCaseScenariosEdited,
	getActiveCaseScenariosEditedKeys,
	getActivePlaceCases,

	getSubstate
}