import watch from 'redux-watch';
import Action from '../state/Action';
import Select from '../state/Select';
import VisualConfig from '../constants/VisualsConfig';
import UrbanTepPortalStore from '../stores/UrbanTepPortalStore';
import _ from 'lodash';

let polyglot = window.polyglot;
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
			case 'sharing#urlReceived':
				showUrl(options);
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

const showUrl = (options) =>  {
	const selectedGroup = options.selectedGroup;
	const isUrbanTep = options.isUrbanTep;
	const url = options.url;
	// Sharing In Portal - How does it look like?
	if(isUrbanTep && options.shareInPortal && selectedGroup && selectedGroup.value && selectedGroup.value.length > 0) {
		let promises = [];
		selectedGroup.value.forEach((group, index) => {
			if(group !== '1' && group !== '2' && group !== '3') {
				promises.push(UrbanTepPortalStore.share(url, options.name, options.description, selectedGroup.title[index]));
			}
		});
		Promise.all(promises).then(() => {
			alert(polyglot.t('theStateWasCorrectlyShared') + url);
		}).catch(err => {
			alert('Error with sharing: ' + err);
		})
	} else {
		alert(polyglot.t('theStateWasCorrectlyShared') + url);
	}
};

const applicationStyleActiveKeyWatcher = (value, previousValue) => {
	console.log('@@ applicationStyleActiveKeyWatcher', previousValue, '->', value);
	if (previousValue !== value){
		let configuration = VisualConfig[value];
		if (configuration && configuration.logoSrc && configuration.headerTitle){
			window.Stores.notify("SHOW_HEADER_LOGO_AND_TITLE", {logo: configuration.logoSrc, title: configuration.headerTitle});
		} else if (configuration && configuration.logoSrc && !configuration.headerTitle){
			window.Stores.notify("SHOW_HEADER_LOGO", configuration.logoSrc);
		} else if (configuration && configuration.headerTitle && !configuration.logoSrc){
			window.Stores.notify("SHOW_HEADER_TITLE", configuration.headerTitle);
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
				shareInPortal: value.toSave.shareInPortal,
				shareInVisat: value.toSave.shareInVisat
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