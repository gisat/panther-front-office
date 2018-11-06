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
	common.createWatcher(store, Select.attributes.getAllForDataviewAsObject, byKeyWatcher, 'byKeyForDataview');
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'ATTRIBUTES_LOADED':
				let oldModels = Select.attributes.getAttributes(store.getState());
				let newModels = utils.removeDuplicities(oldModels, options);
				if (newModels && newModels.length){
					store.dispatch(Action.attributes.add(newModels));
				}
				break;
		}
	});
};

// ======== state watchers ========
const byKeyWatcher = (value, previousValue, stateKey) => {
	console.log('@@@@@ subscribers/attributes#byKeyWatcher', previousValue, '->', value);
	if (stateKey) state[stateKey] = value;
	let diff = common.compareByKey(value, previousValue);

	// todo changed and removed?
	if (diff.added && diff.added.length){
		window.Stores.notify("REDUX_ATTRIBUTES_ADD", diff.added);
	}
};
