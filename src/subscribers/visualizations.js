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
	common.createWatcher(store, Select.visualizations.getActiveKey, activeKeyWatcher);
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
	console.log('@@ activeVisualizationWatcher', previousValue, '->', value);
	if (!previousValue || (previousValue && (previousValue !== value))){
		window.Stores.notify('REDUX_SET_ACTIVE_VISUALIZATION', {key: value});
	}
};
