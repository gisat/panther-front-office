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
	common.createWatcher(store, Select.themes.getAllForDataviewAsObject, byKeyWatcher, 'byKeyForDataview');
	common.createWatcher(store, Select.themes.getActiveKey, activeKeyWatcher);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			default:
				break;
		}
	});
};

// ======== state watchers ========
const activeKeyWatcher = (value, previousValue) => {
	console.log('@@ activeThemeWatcher', previousValue, '->', value);
	if (!previousValue || (previousValue && (previousValue !== value))){
		window.Stores.notify('REDUX_SET_ACTIVE_THEME', {key: value});
	}
};

const byKeyWatcher = (value, previousValue, stateKey) => {
	console.log('@@@@@ subscribers/themes#byKeyWatcher', previousValue, '->', value);
	if (stateKey) state[stateKey] = value;
	let diff = common.compareByKey(value, previousValue);

	// todo changed and removed?
	if (diff.added && diff.added.length){
		window.Stores.notify("REDUX_THEMES_ADD", diff.added);
	}
};
