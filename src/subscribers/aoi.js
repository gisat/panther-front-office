import watch from 'redux-watch';
import Action from '../state/Action';
import Select from '../state/Select';
import _ from 'lodash';
import {geoBounds} from 'd3-geo';

let state = {};

export default store => {

	setStoreWatchers(store);
	setEventListeners(store);

};

const setStoreWatchers = store => {

	createWatcher(store, Select.aoi.getActiveAoiData, activeAOIWatcher);

};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'dataview#activeAoi':
				store.dispatch(Action.aoi.load()).then(() => {
					store.dispatch(Action.aoi.setActiveKey(options.key));
				});
				break;
		}
	});
};

// ======== state watchers ========

const activeAOIWatcher = (value, previousValue) => {
	console.log('@@ activeAOIWatcher', previousValue, '->', value);
	if (value.geometry) {
		let bbox = geoBounds(value.geometry);
		window.Stores.notify('AOI_GEOMETRY_SET', {id: value.key, geometry: value.geometry, extent: bbox});
	}
};

// ======== event listeners ========



// ======== helpers ========




/////// logic todo move to common location

const createWatcher = (store, selector, watcher, stateKey) => {
	if (stateKey) {
		state[stateKey] = selector(store.getState());
		store.subscribe(watch(() => selector(store.getState()))((value, previousValue) => {
			state[stateKey] = value;
			watcher(value, previousValue);
		}));
	} else {
		store.subscribe(watch(() => selector(store.getState()))(watcher));
	}
};