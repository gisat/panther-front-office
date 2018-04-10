import Action from '../state/Action';
import utils from '../utils/utils';
import Select from "../state/Select";
import watch from "redux-watch";

let state = {};

export default store => {
	setEventListeners(store);
	setStoreWatchers(store);
};

const setStoreWatchers = store => {

	createWatcher(store, Select.scopes.getActiveScopeKey, activeScopeKeyWatcher);

};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'SCOPES_LOADED':
				store.dispatch(Action.scopes.add(utils.replaceIdWithKey(options)));
				break;
			case 'scope#activeScopeChanged':
				let state = store.getState();
				if (state.user.isAdmin){
					store.dispatch(Action.scopes.setActiveScopeKey(options.activeScopeKey)).then(() => {
						store.dispatch(Action.aoi.load());
					});
				} else {
					store.dispatch(Action.scopes.setActiveScopeKey(options.activeScopeKey));
				}


				break;
		}
	});
};

// ======== state watchers ========

const activeScopeKeyWatcher = (value, previousValue) => {
	console.log('@@ activeScopeKeyWatcher', previousValue, '->', value);
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
