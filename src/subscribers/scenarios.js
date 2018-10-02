import Action from '../state/Action';
import mapUtils from '../utils/map';
import Select from "../state/Select";
import watch from "redux-watch";
import _ from "lodash";

let state = {};

export default store => {
	setEventListeners(store);
	setStoreWatchers(store);
};

const setStoreWatchers = store => {
	createWatcher(store, Select.scenarios.cases.getSubstate, casesSubstateWatcher, 'cases');
	createWatcher(store, Select.scenarios.scenarios.getSubstate, scenariosSubstateWatcher, 'scenarios');
	createWatcher(store, Select.scenarios.cases.getActive, activeCaseWatcher);
	createWatcher(store, Select.scenarios.cases.getActiveCaseScenarios, activeCaseScenariosWatcher, 'activeScenarios');
	createWatcher(store, Select.scenarios.scenarios.getActiveKeys, activeScenarioKeysWatcher);
	createWatcher(store, Select.scenarios.scenarios.isDefaultSituationActive, defaultSituationWatcher);
	createWatcher(store, Select.scenarios.cases.getAll, casesWatcher);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'scenario#removeActive':
				store.dispatch(Action.scenarios.removeActiveScenario(options.scenarioKey));
				break;
			case 'scenario#removeDefaultSituation':
				store.dispatch(Action.scenarios.setDefaultSituationActive(false));
				break;
			case 'scenarios#applyFromDataview':
				let cases = Select.scenarios.cases.getAll(store.getState());

				// apply dataview settings only if cases are loaded. Otherwise use watcher to watch when cases are loaded and then apply dataview settings
				if (cases && cases.length){
					let viewData = options.scenarios;

					// convert from old data structure
					let data = {
						cases: viewData.cases,
						scenarios: viewData.activeKeys ? _.omit(viewData, "cases") : viewData.scenarios
					};
					state.scenariosDataviewSettings = null;
					store.dispatch(Action.scenarios.applyDataviewSettings(data));
				} else {
					state.scenariosDataviewSettings = options;
				}
				break;
		}
	});
};

// ======== state watchers ========

const activeScenarioKeysWatcher = (value, previousValue) => {
	console.log('@@ activeScenarioKeysWatcher', previousValue, '->', value);
	let difference = compareActiveScenarios(value,previousValue);
	console.log('@@ difference', difference);
	_.each(difference.added, (value) => {
		let scenarioData = _.find(state.activeScenarios, (scenario)=>{
			return scenario.key === value});
		window.Stores.notify('ADD_MAP_BY_SCENARIO', {
			scenarioKey: value,
			scenarioData: scenarioData ? scenarioData.data : null
		});
	});
	_.each(difference.removed, (value) => {
		window.Stores.notify('REMOVE_MAP_BY_SCENARIO', {
			scenarioKey: value
		});
	});
};

const defaultSituationWatcher = (value, previousValue) => {
	console.log('@@ defaultSituationWatcher', previousValue, '->', value);
	if (previousValue !== value){
		window.Stores.notify('HANDLE_SCENARIO_DEFAULT_SITUATION', {showDeafaultSituation: value});
	}
};

const activeCaseScenariosWatcher = (value, previousValue) => {
	console.log('@@ activeCaseScenariosWatcher', previousValue, '->', value);
};

const casesWatcher = (value, previousValue) => {
	console.log('@@ casesWatcher', previousValue, '->', value);
	if (value && state.scenariosDataviewSettings){
		window.Stores.notify("scenarios#applyFromDataview", state.scenariosDataviewSettings);
	}
};

const activeCaseWatcher = (value, previousValue) => {
	console.log('@@ activeCaseWatcher', previousValue, '->', value);
	let options = null;
	if (value){

		// if case has geometry, pass it as an option
		if (value.data && value.data.geometry){
			options = {bbox: mapUtils.getGeometryBbox(value.data.geometry)};

			// zoom to geometry if geometry was changed
			let currentGeomString = JSON.stringify(value.data.geometry);
			let previousGeomString = previousValue && previousValue.data && previousValue.data.geometry ? JSON.stringify(previousValue.data.geometry) : "";

			if (currentGeomString !== previousGeomString){
				window.Stores.notify('ZOOM_MAPS_BY_CASE_GEOMETRY', options);
			}
		}
	}
};

const compareActiveScenarios = (next, prev) => {
	if (prev) {
		let nextScenarios = [];
		if (_.isArray(next)){
			nextScenarios = next;
		}
		return {
			added: _.difference(nextScenarios, prev),
			removed: _.difference(prev, nextScenarios)
		};
	} else {
		return {
			added: next
		};
	}
};

const casesSubstateWatcher = (data, previousData) => {
	console.log('@@ casesSubstateWatcher', data);
};

const scenariosSubstateWatcher = (data, previousData) => {
	console.log('@@ scenariosSubstateWatcher', data);
	if (data){
		let dataForView = {
			cases: {
				activeKey: state.cases.activeKey
			},
			scenarios: {
				activeKeys: data.activeKeys,
				defaultSituationActive: data.defaultSituationActive
			}
		};
		window.Stores.notify('REDUX_STORE_SCENARIOS_CHANGED', dataForView);
	}
};

/////// logic todo move to common location
const createWatcher = (store, selector, watcher, stateKey) => {
	if (stateKey) {
		state[stateKey] = selector(store.getState());
		store.subscribe(watch(() => selector(store.getState()))((value, previousValue) => {
			state[stateKey] = value;
			watcher(value, previousValue);
		}));
	} else {
		store.subscribe(watch(() => selector(store.getState()))(watcher));
	}
};
