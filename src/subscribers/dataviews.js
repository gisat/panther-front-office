import _ from 'lodash';
import common from "./_common";
import Action from '../state/Action';
import Select from "../state/Select";

import loadApp from '../app-old';

let legacyCodeInitialized = false;

export default store => {
	setEventListeners(store);
	setStoreWatchers(store);
};

const setStoreWatchers = store => {
	common.createWatcher(store, Select.dataviews.getDataForInitialLoad, dataForInitialLoadWatcher);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			default:
				break;
		}
	});
};

// ======== state watchers ========
const dataForInitialLoadWatcher = (value) => {
	console.log('@@@@@ subscribers/scopes#getDataForInitialLoad', value);
	if (value && !legacyCodeInitialized){
		let allStoresLoaded = true;
		_.forIn(value, (val, key) => {
			if (!val && key !== "activeScopeStyle"){
				allStoresLoaded = false;
			}
		});
		if (allStoresLoaded){
			console.log('@@@@@ subscribers/scopes#getDataForInitialLoad: Start legacy code initial load!');
			loadApp(value);

			legacyCodeInitialized = true;
		}
	}
};