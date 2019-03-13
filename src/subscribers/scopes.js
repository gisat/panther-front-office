import Action from '../state/Action';
import utils from '../utils/utils';
import Select from "../state/Select";
import watch from "redux-watch";
import _ from "lodash";

import common from "./_common";

let state = {};

export default store => {
	setEventListeners(store);
	setStoreWatchers(store);
};

const setStoreWatchers = store => {
	common.createWatcher(store, Select.scopes.getAllForDataviewAsObject, byKeyWatcher, 'byKeyForDataview');

	createWatcher(store, Select.scopes.getActiveScopeKey, activeScopeKeyWatcher);
	createWatcher(store, Select.scopes.getActiveScopeData, activeScopeWatcher, 'scope');

};

const setEventListeners = store => {
};

// ======== state watchers ========
const byKeyWatcher = (value, previousValue, stateKey) => {
	console.log('@@@@@ subscribers/scopes#byKeyWatcher', previousValue, '->', value);
	if (stateKey) state[stateKey] = value;
	let diff = common.compareByKey(value, previousValue);

	// todo changed and removed?
	if (diff.added && diff.added.length){
		window.Stores.notify("REDUX_SCOPES_ADD", diff.added);
	}
};



const activeScopeKeyWatcher = (value, previousValue) => {
	console.log('@@ activeScopeKeyWatcher', previousValue, '->', value);
};
const activeScopeWatcher = (value, previousValue) => {
	toggleBodyClasses(value.data, previousValue);
	if (value && value.data && value.data.configuration && value.data.configuration.tour) {
		window.Stores.notify("REDUX_TOUR_CHANGED", {tour: value.data.configuration.tour});
	}
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
