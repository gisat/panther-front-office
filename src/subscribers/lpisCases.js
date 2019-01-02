import Action from '../state/Action';
import utils from '../utils/utils';
import Select from "../state/Select";
import watch from "redux-watch";

let state = {};

export default store => {
	setStoreWatchers(store);
};

const setStoreWatchers = store => {
	createWatcher(store, Select.specific.lpisChangeReviewCases.getActiveCase, activeLpisCaseWatcher);
};

// ======== state watchers ========

const activeLpisCaseWatcher = (value, previousValue) => {
	console.log('@@ activeLpisCaseWatcher', previousValue, '->', value);
	if (value && value.status){
		if (value.status === "CREATED"){
			window.Stores.notify("MAP_CLOSE_BUTTON_ADD");
		} else {
			window.Stores.notify("MAP_CLOSE_BUTTON_REMOVE");
		}
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
