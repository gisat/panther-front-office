import Action from '../state/Action';
import utils from '../utils/utils';
import Select from "../state/Select";
import common from "./_common";

let state = {};
export default store => {
	setEventListeners(store);
	setStoreWatchers(store);
};

const setStoreWatchers = store => {
	common.createWatcher(store, Select.visualizations.getActiveKey, activeKeyWatcher);
	common.createWatcher(store, Select.visualizations.getAllForDataviewAsObject, byKeyWatcher, 'byKeyForDataview');
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case "VISUALISATIONS_REFRESH":
				store.dispatch(Action.visualizations.setOutdated());
				store.dispatch(Action.visualizations.refreshUses());
				break;
			default:
				break;
		}
	});
};

// ======== state watchers ========
const activeKeyWatcher = (value, previousValue) => {
	console.log('@@ activeVisualizationWatcher', previousValue, '->', value);
	if (!previousValue || (previousValue && (previousValue !== value))){
		window.Stores.notify('REDUX_SET_ACTIVE_VISUALIZATION', {key: value});
	}
};

const byKeyWatcher = (value, previousValue, stateKey) => {
	console.log('@@@@@ subscribers/visualizations#byKeyWatcher', previousValue, '->', value);
	if (stateKey) state[stateKey] = value;
	let diff = common.compareByKey(value, previousValue);

	// todo changed and removed?
	if (diff.added && diff.added.length){
		window.Stores.notify("REDUX_VISUALIZATIONS_ADD", diff.added);
	}
};
