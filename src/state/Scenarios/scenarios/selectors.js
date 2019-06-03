import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../../_common/selectors";
import MapsSelectors from "../../Maps/selectors";

const getSubstate = state => state.scenarios.scenarios;

const isDefaultSituationActive = state => state.scenarios.scenarios.defaultSituationActive;

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);
const getActiveKeys = common.getActiveKeys(getSubstate);
const getActive = common.getActive(getSubstate);
const getActiveScenarios = common.getActiveModels(getSubstate);

const getByKey = common.getByKey(getSubstate);

const getEditedAll = common.getEditedAll(getSubstate);
const getEditedAllAsObject = common.getEditedAllAsObject(getSubstate);
const getEditedByKey = common.getEditedByKey(getSubstate);

const getEditedKeys = common.getEditedKeys(getSubstate);

/**
 * Select spatial data source for scenario (based on source type)
 */
const getPucsScenariosVectorSource = createSelector(
	[
		(state, scenarioKey, defaultSituation) => {return {scenarioKey: scenarioKey, defaultSituation: defaultSituation}}
	],
	(scenarioData, vectorLayers) => {
		let source = null;
		if (scenarioData.scenarioKey && vectorLayers.length){
			source = _.find(vectorLayers, {'scenarioKey': scenarioData.scenarioKey});
		} else if (scenarioData.defaultSituation && vectorLayers.length){
			source = _.find(vectorLayers, {'scenarioKey': null});
		}

		return source ? source : null;
	}
);

export default {
	getActive,
	getActiveKey,
	getActiveKeys,
	getActiveScenarios,
	getAll,
	getAllAsObject,
	getByKey,
	getEditedAll,
	getEditedAllAsObject,
	getEditedByKey,
	getEditedKeys,

	getSubstate,
	isDefaultSituationActive,
	getPucsScenariosVectorSource
}