import watch from 'redux-watch';
import Action from '../state/Action';
import Select from '../state/Select';
import VisualConfig from '../constants/VisualsConfig';
import _ from 'lodash';

let Observer = window.Observer;

let state = {};
export default store => {
	setEventListeners(store);
	setStoreWatchers(store);
};

const setStoreWatchers = store => {
	createWatcher(store, Select.components.windows.isWindowOpen, scenariosWindowWatcher, null, {key: 'scenarios'});
	createWatcher(store, Select.components.windows.isWindowOpen, snapshotsWindowWatcher, null, {key: 'snapshots'});
	createWatcher(store, Select.components.windows.isWindowOpen, viewsWindowWatcher, null, {key: 'views'});
	createWatcher(store, Select.components.getComponents, componentsWatcher);
	createWatcher(store, Select.components.getApplicationStyleActiveKey, applicationStyleActiveKeyWatcher);
	createWatcher(store, Select.components.getApplicationStyleHtmlClass, applicationStyleHtmlClassWatcher);
	createWatcher(store, Select.components.getShare, shareWatcher);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'application#setHtmlClass':
				store.dispatch(Action.components.setApplicationStyleHtmlClass(options.configuration, options.htmlClass));
				break;
			case 'component#scenarioButtonClick':
				let open = Select.components.windows.isWindowOpen(store.getState(), {key: 'scenarios'});
				store.dispatch(Action.components.windows.handleWindowVisibility('scenarios', !open));
				break;
			case 'component#snapshotsButtonClick':
				let snapshotsOpen = Select.components.windows.isWindowOpen(store.getState(), {key: 'snapshots'});
				store.dispatch(Action.components.windows.handleWindowVisibility('snapshots', !snapshotsOpen));
				break;
			case 'component#viewsButtonClick':
				let viewsOpen = Select.components.windows.isWindowOpen(store.getState(), {key: 'views'});
				store.dispatch(Action.components.windows.handleWindowVisibility('views', !viewsOpen));
				break;
			case 'components#applyFromDataview':
				store.dispatch(Action.components.update("windows", options.windows));
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
		if (configuration && configuration.logoSrc){
			window.Stores.notify("SHOW_HEADER_LOGO", configuration.logoSrc);
		}
	}
};

const applicationStyleHtmlClassWatcher = (value, previousValue) => {
	console.log('@@ applicationStyleHtmlClassWatcher', previousValue, '->', value);
	if (previousValue !== value){
		if (previousValue){
			// remove class from html element
			document.documentElement.classList.remove(previousValue);
		}
		if (value) {
			// add class to html element
			document.documentElement.classList.add(value);
		}
	}
};

const shareWatcher = (value, previousValue) => {
	console.log('@@ shareWatcher', previousValue, '->', value);
	if (previousValue !== value){

		if (!previousValue.toSave && value.toSave) {
			Observer.notify("PumaMain.controller.ViewMng.onShare", {
				state: state,
				name: value.toSave.name.value,
				language: value.toSave.langSelect,
				description: value.toSave.description.value,
				group: value.toSave.groupsSelect,
				user: value.toSave.usersSelect,
				dataviewId: value.toSave.dataviewId,
			});
	
		}
	}
};

const scenariosWindowWatcher = (value, previousValue) => {
	console.log('@@ scenariosWindowWatcher', previousValue, '->', value);
	if (previousValue !== value){
		window.Stores.notify('SCENARIOS_WINDOW_TOGGLE');
	}
};

const snapshotsWindowWatcher = (value, previousValue) => {
	console.log('@@ snapshotsWindowWatcher', previousValue, '->', value);
	if (previousValue !== value){
		window.Stores.notify('SNAPSHOTS_WINDOW_TOGGLE');
	}
};

const viewsWindowWatcher = (value, previousValue) => {
	console.log('@@ viewsWindowWatcher', previousValue, '->', value);
	if (previousValue !== value){
		window.Stores.notify('DATAVIEWS_WINDOW_TOGGLE');
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