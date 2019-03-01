import Action from '../state/Action';
import utils from '../utils/utils';
import Select from "../state/Select";
import common from "./_common";

let state = {};
export default store => {
	setStoreWatchers(store);
};

const setStoreWatchers = store => {
	common.createWatcher(store, Select.topics.getAllForDataviewAsObject, byKeyWatcher, 'byKeyForDataview');
};

const byKeyWatcher = (value, previousValue, stateKey) => {
	console.log('@@@@@ subscribers/topics#byKeyWatcher', previousValue, '->', value);
	if (stateKey) state[stateKey] = value;
	let diff = common.compareByKey(value, previousValue);

	// todo changed and removed?
	if (diff.added && diff.added.length){
		window.Stores.notify("REDUX_TOPICS_ADD", diff.added);
	}
};
