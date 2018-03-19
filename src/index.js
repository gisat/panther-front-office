import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './state/Store';

import './index.css';
import MapsTimelineContainer from './components/controls/MapsTimelineContainer/index';
import OverlayContainer from './components/controls/OverlayContainer/index';
import ViewSelectorContainer from './components/controls/ViewSelectorContainer/index';
import registerServiceWorker from './registerServiceWorker';


let getStore = function() {
	if (window.Stores && window.Stores.hasOwnProperty('addListener')) {
		initialize();
	} else {
		setTimeout(getStore, 200);
	}
};

let initialize = function() {

	ReactDOM.render(<Provider store={store}><MapsTimelineContainer /></Provider>, document.getElementById('maps-timeline'));
	ReactDOM.render(<Provider store={store}><ViewSelectorContainer /></Provider>, document.getElementById('header-view-selection'));
	ReactDOM.render(<Provider store={store}><OverlayContainer /></Provider>, document.getElementById('root'));

};


getStore();


registerServiceWorker();
