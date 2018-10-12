import watch from 'redux-watch';
import Action from '../state/Action';
import Select from '../state/Select';
import VisualConfig from '../constants/VisualsConfig';
import _ from 'lodash';

let state = {};
export default store => {
	setEventListeners(store);
	setStoreWatchers(store);
};

const setStoreWatchers = store => {
	createWatcher(store, Select.components.windows.isWindowOpen, scenariosWindowWatcher, null, {key: 'scenarios'});
	createWatcher(store, Select.components.windows.isWindowOpen, viewsWindowWatcher, null, {key: 'views'});
	createWatcher(store, Select.components.getComponents, componentsWatcher);
	createWatcher(store, Select.components.getApplicationStyleActiveKey, applicationStyleActiveKeyWatcher);
	createWatcher(store, Select.components.getApplicationStyleHtmlClass, applicationStyleHtmlClassWatcher);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'application#setHtmlClass':
				store.dispatch(Action.components.setApplicationStyleHtmlClass(options));
				break;
			case 'component#scenarioButtonClick':
				let open = Select.components.windows.isWindowOpen(store.getState(), {key: 'scenarios'});
				store.dispatch(Action.components.windows.handleWindowVisibility('scenarios', !open));
				break;
			case 'component#viewsButtonClick':
				let viewsOpen = Select.components.windows.isWindowOpen(store.getState(), {key: 'views'});
				store.dispatch(Action.components.windows.handleWindowVisibility('views', !viewsOpen));
				break;
			case 'components#applyFromDataview':
				store.dispatch(Action.components.update("windows", options.windows));
				break;
			case 'components#applicationMode':
				store.dispatch(Action.components.setIntro(false));
				break;
			case 'components#mapsGridChanged':
				let state = Select.components.getMapsContainer(store.getState());
				if (state.columns !== options.columns || state.rows !== options.rows){
					store.dispatch(Action.components.updateMapsContainer(options));
				}
				break;
		}
	});
};

const applicationStyleActiveKeyWatcher = (value, previousValue) => {
	console.log('@@ applicationStyleActiveKeyWatcher', previousValue, '->', value);
	if (previousValue !== value){
		let configuration = VisualConfig[value];
		if (configuration){
			// todo apply configuration for old code
		}
	}
};

const applicationStyleHtmlClassWatcher = (value, previousValue) => {
	console.log('@@ applicationStyleHtmlClassWatcher', previousValue, '->', value);
	if (previousValue !== value){
		if (previousValue){
			// add class to html element
			document.documentElement.classList.remove(previousValue);
		}
		if (value) {
			// add class from html element
			document.documentElement.classList.add(value);
		}
	}
};

const scenariosWindowWatcher = (value, previousValue) => {
	console.log('@@ scenariosWindowWatcher', previousValue, '->', value);
	if (previousValue !== value){
		window.Stores.notify('SCENARIOS_WINDOW_TOGGLE');
	}
};

const viewsWindowWatcher = (value, previousValue) => {
	console.log('@@ viewsWindowWatcher', previousValue, '->', value);
	if (previousValue !== value){
		window.Stores.notify('VIEWS_WINDOW_TOGGLE');
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