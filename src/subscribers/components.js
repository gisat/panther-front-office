import watch from 'redux-watch';
import Action from '../state/Action';
import Select from '../state/Select';
import _ from 'lodash';

let state = {};
export default store => {
	setEventListeners(store);
	setStoreWatchers(store);
};

const setStoreWatchers = store => {
	createWatcher(store, Select.components.windows.isWindowOpen, sceanriosWindowWatcher, null, {key: 'scenarios'});
	createWatcher(store, Select.components.getComponents, componentsWatcher);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'header#uploadDataClick':
				store.dispatch(Action.components.overlays.openOverlay('dataUpload'));
				break;
			case 'component#scenarioButtonClick':
				let open = Select.components.windows.isWindowOpen(store.getState(), {key: 'scenarios'});
				store.dispatch(Action.components.windows.handleWindowVisibility('scenarios', !open));
				break;
			case 'components#applyFromDataview':
				store.dispatch(Action.components.update("windows", options.windows));
				break;
			case 'components#applicationMode':
				store.dispatch(Action.components.overlays.views.setInactive());
				break;
		}
	});
};

const sceanriosWindowWatcher = (value, previousValue) => {
	console.log('@@ activeMapKeyWatcher', previousValue, '->', value);
	if (previousValue !== value){
		window.Stores.notify('SCENARIOS_WINDOW_TOGGLE');
	}
};

const componentsWatcher = (value, previousValue) => {
	console.log('@@ componentsWatcher', value);
	window.Stores.notify('REDUX_STORE_COMPONENTS_CHANGED', value);
};

/////// logic todo move to common location

const createWatcher = (store, selector, watcher, stateKey, props) => {
	if (stateKey) {
		state[stateKey] = selector(store.getState());
		store.subscribe(watch(() => selector(store.getState()))((value, previousValue) => {
			state[stateKey] = value;
			watcher(value, previousValue);
		}));
	} else if (props){
		store.subscribe(watch(() => selector(store.getState(), props))(watcher));
	} else {
		store.subscribe(watch(() => selector(store.getState()))(watcher));
	}
};