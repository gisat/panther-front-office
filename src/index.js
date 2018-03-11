import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './state/Store';

import './index.css';
import App from './App';
import MapsTimeline from './components/controls/MapsTimeline';
import registerServiceWorker from './registerServiceWorker';

//ReactDOM.render(<App />, document.getElementById('root'));

let getStore = function() {
	if (window.Stores && window.Stores.hasOwnProperty('addListener')) {
		window.Stores.addListener(listener);
	} else {
		setTimeout(getStore, 200);
	}
};

let listener = function(event, options) {
	if (event == "PERIODS_LOADED") {
		initialize();
	}
};

let initialize = function() {

	ReactDOM.render(<Provider store={store}><MapsTimeline /></Provider>, document.getElementById('maps-timeline'));

};


getStore();


registerServiceWorker();
