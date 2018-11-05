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
	common.createWatcher(store, Select.periods.getAllForDataviewAsObject, byKeyWatcher, 'byKeyForDataview');
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'PERIODS_LOADED':
				let oldModels = Select.periods.getPeriods(store.getState());
				let newModels = utils.removeDuplicities(oldModels, options);
				if (newModels && newModels.length){
					store.dispatch(Action.periods.add(newModels));
				}
				break;
			case 'periods#change':
			case 'periods#initial':
				onPeriodsChanged(store, options);
				break;
			default:
				break;
		}
	});
};

// ======== state watchers ========
const byKeyWatcher = (value, previousValue, stateKey) => {
	console.log('@@@@@ subscribers/periods#byKeyWatcher', previousValue, '->', value);
	if (stateKey) state[stateKey] = value;
	let diff = common.compareByKey(value, previousValue);

	// todo changed and removed?
	if (diff.added && diff.added.length){
		window.Stores.notify("REDUX_PERIODS_ADD", diff.added);
	}
};

const onPeriodsChanged = (store, options, initial) => {
	if (options.length === 1){
		store.dispatch(Action.periods.setActiveKey(options[0]));
	}
};
