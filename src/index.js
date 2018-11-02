import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './state/Store';
import Action from './state/Action';

import './index.css';
import './projects.css';
import { unregister } from './registerServiceWorker';
import loadApp from './app-old';

import AppOverlays from './components/presentation/overlays/AppOverlays';
import MapsTimeline from './scopemagicswitches/MapsTimeline';
import HeaderViewSelector from './scopemagicswitches/HeaderViewSelector';
import ViewSelectorOverlay from './scopemagicswitches/ViewSelectorOverlay';
import ViewSelector from './scopemagicswitches/ViewSelector';

import DockedWindowsContainer from './components/containers/windowsContainers/DockedWindowsContainer';
import WindowsContainer from './components/containers/windowsContainers/WindowsContainer';
import ScopePlaceThemeSelectionSwitch from "./components/containers/temporary/ScopePlaceThemeSelectionSwitch";

let url = new URL(window.location);
let id = url.searchParams.get('id');

let getStore = function() {
	if (window.Stores && window.Stores.hasOwnProperty('addListener')) {
		initialize();
	} else {
		setTimeout(getStore, 200);
	}
};

let initialize = function() {

	ReactDOM.render(<Provider store={store}><MapsTimeline /></Provider>, document.getElementById('maps-timeline'));
	ReactDOM.render(<Provider store={store}><HeaderViewSelector /></Provider>, document.getElementById('header-view-selection'));
	ReactDOM.render(<Provider store={store}><ViewSelectorOverlay	/></Provider>, document.getElementById('root'));
	ReactDOM.render(<Provider store={store}><ViewSelector	/></Provider>, document.getElementById('view-selector-placeholder'));


	ReactDOM.render(<Provider store={store}>
		<div>
			<AppOverlays/>
			<WindowsContainer/>
		</div>
	</Provider>, document.getElementById('app-container'));

	ReactDOM.render(<Provider store={store}>
		<DockedWindowsContainer/>
	</Provider>, document.getElementById('maps-tools'));

	// temporary components
	ReactDOM.render(<Provider store={store}><ScopePlaceThemeSelectionSwitch/></Provider>, document.getElementById('scope-selection-switch-container'));

	if(!id) {
		// Render TopToolbar Component.
	}
};

if(!id) {
	// Load Scopes
	store.dispatch(Action.scopes.loadAll());
	// Load Current User
	store.dispatch(Action.users.apiLoadCurrentUser());

	initialize();
} else {
	store.dispatch(Action.dataviews.loadByKey(Number(id)));
    getStore();
}

unregister();
loadApp();
