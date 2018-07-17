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
	createWatcher(store, Select.scopes.getActiveScopeData, activeScopeWatcher, 'scope');

};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'SCOPES_LOADED':
				let oldModels = Select.scopes.getScopes(store.getState());
				let newModels = utils.removeDuplicities(oldModels, options);
				if (newModels && newModels.length){
					store.dispatch(Action.scopes.add(newModels));
				}
				break;
			case 'scope#activeScopeChanged':
				store.dispatch(Action.scopes.setActiveScopeKey(options.activeScopeKey));
				break;
		}
	});
};

// ======== state watchers ========

const activeScopeKeyWatcher = (value, previousValue) => {
	console.log('@@ activeScopeKeyWatcher', previousValue, '->', value);
};
const activeScopeWatcher = (value, previousValue) => {
	toggleBodyClasses(value, previousValue);
};

const toggleBodyClasses = (scope, previousScope) => {
	if (scope && scope.configuration && scope.configuration.hasOwnProperty('headerComponent')) {
		switch (scope.configuration.headerComponent) {
			case 'dromasLpisChangeReview':
				document.documentElement.classList.add('toggle-customHeader');
				window.Stores.notify('resizeMap');
				break;
			default:
				document.documentElement.classList.remove('toggle-customHeader');
				break;
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
