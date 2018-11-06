import Action from '../state/Action';
import utils from '../utils/utils';
import watch from "redux-watch";
import Select from "../state/Select";
import common from "./_common";


let state = {};
export default store => {
	setEventListeners(store);
	setStoreWatchers(store);
};

const setStoreWatchers = store => {
	common.createWatcher(store, Select.attributeSets.getAllForDataviewAsObject, byKeyWatcher, 'byKeyForDataview');
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'ATTRIBUTE_SETS_LOADED':
				let oldModels = Select.attributeSets.getAttributeSets(store.getState());
				let newModels = utils.removeDuplicities(oldModels, options);
				if (newModels && newModels.length){
					store.dispatch(Action.attributeSets.add(newModels));
				}
				break;
			case 'attributeSets#updateActive':
				store.dispatch(Action.attributeSets.updateActive(options.attributeSets));
				break;
		}
	});
};

// ======== state watchers ========
const byKeyWatcher = (value, previousValue, stateKey) => {
	console.log('@@@@@ subscribers/attributeSets#byKeyWatcher', previousValue, '->', value);
	if (stateKey) state[stateKey] = value;
	let diff = common.compareByKey(value, previousValue);

	// todo changed and removed?
	if (diff.added && diff.added.length){
		window.Stores.notify("REDUX_ATTRIBUTE_SETS_ADD", diff.added);
	}
};
