import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './state/Store';

import './index.css';
import MapsTimeline from './components/controls/MapsTimeline';
import ViewSelector from './components/controls/ViewSelector';
import registerServiceWorker from './registerServiceWorker';


let getStore = function() {
	if (window.Stores && window.Stores.hasOwnProperty('addListener')) {
		initialize();
	} else {
		setTimeout(getStore, 200);
	}
};

let initialize = function() {

	ReactDOM.render(<Provider store={store}><MapsTimeline /></Provider>, document.getElementById('maps-timeline'));
	ReactDOM.render(<Provider store={store}><ViewSelector /></Provider>, document.getElementById('header-view-selection'));

};


getStore();


registerServiceWorker();
