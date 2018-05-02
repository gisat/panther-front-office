import Action from '../state/Action';
import utils from '../utils/utils';
import Select from "../state/Select";
import watch from "redux-watch";
import _ from "lodash";

let state = {};

export default store => {
	setEventListeners(store);
	setStoreWatchers(store);
};

const setStoreWatchers = store => {
	createWatcher(store, Select.scenarios.getActiveKeys, activeScenarioKeysWatcher);
	createWatcher(store, Select.scenarios.isDefaultSituationActive, defaultSituationWatcher);
	createWatcher(store, Select.scenarios.getActiveCaseScenarios, activeCaseScenariosWatcher, 'activeScenarios');
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
			scenarioData: scenarioData
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
