import Action from '../state/Action';
import utils from '../utils/utils';
import watch from "redux-watch";
import Select from "../state/Select";

let state = {};

export default store => {
	setStoreWatchers(store);
	setEventListeners(store);
};

const setStoreWatchers = store => {
	createWatcher(store, Select.areas.selections.getAllByColour, selectionsWatcher);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'SELECTIONS_FILTER_UPDATE_BY_COLOUR':
				store.dispatch(Action.areas.selections.updateSelectionByColour(transformToHex(options.colour), options.attributeFilter));
				break;
			case 'SELECTIONS_ADD_ACTIVE_BY_COLOUR':
				store.dispatch(Action.areas.selections.addActiveKeyByColour(transformToHex(options.colour)));
				break;
			case 'selection#activeCleared':
				store.dispatch(Action.areas.selections.removeActiveKeyByColour(transformToHex(options.color)));
				break;
			case 'selection#everythingCleared':
				store.dispatch(Action.areas.selections.setActiveKeys(null));
				break;
		}
	});
};

const selectionsWatcher = (value, previousValue) => {
	console.log('@@@@ selectionsWatcher', value);
	if (value){
		window.Stores.notify("SELECTIONS_CHANGE_SETTINGS", value);
	}
};

// helpers
const transformToHex = (colour) => {
	return `#${colour}`;
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