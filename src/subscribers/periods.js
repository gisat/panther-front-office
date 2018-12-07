import Action from '../state/Action';
import Select from "../state/Select";
import common from "./_common";
import _ from "lodash";

let state = {};
export default store => {
	setEventListeners(store);
	setStoreWatchers(store);
};

const setStoreWatchers = store => {
	common.createWatcher(store, Select.periods.getAllForDataviewAsObject, byKeyWatcher, 'byKeyForDataview');
	common.createWatcher(store, Select.periods.getActiveKeys, activeKeysWatcher);
	common.createWatcher(store, Select.periods.getActiveKey, activeKeyWatcher);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case "periods#change":
				let periods = options;
				if (_.isArray(periods)){
					if (periods.length > 1){
						store.dispatch(Action.periods.setActiveKeys(periods));
					} else {
						store.dispatch(Action.periods.setActiveKey(periods[0]));
					}
				} else {
					store.dispatch(Action.periods.setActiveKey(periods));
				}
				break;
			default:
				break;
		}
	});
};

// ======== state watchers ========
const activeKeysWatcher = (value, previousValue) => {
	console.log('@@ activePeriodsWatcher', previousValue, '->', value);
	if (value && (!previousValue || (previousValue && (previousValue !== value)))){
		window.Stores.notify('REDUX_SET_ACTIVE_PERIODS', {keys: value});
	}
};

const activeKeyWatcher = (value, previousValue) => {
	console.log('@@ activePeriodsWatcher', previousValue, '->', value);
	if (value && (!previousValue || (previousValue && (previousValue !== value)))){
		window.Stores.notify('REDUX_SET_ACTIVE_PERIODS', {keys: [value]});
	}
};

const byKeyWatcher = (value, previousValue, stateKey) => {
	console.log('@@@@@ subscribers/periods#byKeyWatcher', previousValue, '->', value);
	if (stateKey) state[stateKey] = value;
	let diff = common.compareByKey(value, previousValue);

	// todo changed and removed?
	if (diff.added && diff.added.length){
		window.Stores.notify("REDUX_PERIODS_ADD", diff.added);
	}
};
