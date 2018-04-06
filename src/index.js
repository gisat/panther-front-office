import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './state/Store';

import './index.css';
import OverlayContainer from './components/controls/OverlayContainer/index';
import ViewSelectorContainer from './components/controls/ViewSelectorContainer/index';
import registerServiceWorker from './registerServiceWorker';

import MapsTimeline from './scopemagicswitches/MapsTimeline';


let getStore = function() {
	if (window.Stores && window.Stores.hasOwnProperty('addListener')) {
		initialize();
	} else {
		setTimeout(getStore, 200);
	}
};

let initialize = function() {

	ReactDOM.render(<Provider store={store}><MapsTimeline /></Provider>, document.getElementById('maps-timeline'));
	ReactDOM.render(<Provider store={store}><ViewSelectorContainer /></Provider>, document.getElementById('header-view-selection'));
	ReactDOM.render(<Provider store={store}><OverlayContainer
			contentOffset={{
				top: 100,
				left: 200
			}}
			content={{
				title: "Insert AOI Code",
				text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Etiam dui sem, fermentum vitae, sagittis id, malesuada in, quam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos."
			}}
		/></Provider>, document.getElementById('root'));

};


getStore();


registerServiceWorker();
