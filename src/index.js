import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './state/Store';

import './index.css';
import registerServiceWorker from './registerServiceWorker';

import AppOverlays from './scopemagicswitches/AppOverlays';
import MapsTimeline from './scopemagicswitches/MapsTimeline';
import HeaderViewSelector from './scopemagicswitches/HeaderViewSelector';
import ViewSelectorOverlay from './scopemagicswitches/ViewSelectorOverlay';
import ViewSelector from './scopemagicswitches/ViewSelector';


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
	ReactDOM.render(<Provider store={store}><AppOverlays	/></Provider>, document.getElementById('app-overlays'));
};


getStore();


registerServiceWorker();
