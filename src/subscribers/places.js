import _ from 'lodash';
import watch from "redux-watch";
import {geoBounds} from 'd3-geo';

import Action from '../state/Action';
import utils from '../utils/utils';
import Select from "../state/Select";

let state = {};

export default store => {
	setEventListeners(store);
	setStoreWatchers(store);
};

const setStoreWatchers = store => {
	createWatcher(store, Select.places.getActive, activePlaceWatcher);
	createWatcher(store, Select.places.getActivePlaces, activePlacesWatcher);
};


const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'PLACES_LOADED':
				store.dispatch(Action.places.add(_.map(options, transform)));
				break;
			case 'place#setActivePlace':
				if (typeof options.data === "number"){
					store.dispatch(Action.places.setActive(options.data));
				} else if (options.data.length && options.data.length === 1){
					store.dispatch(Action.places.setActive(options.data[0]));
				} else if (options.data.length && options.data.length > 1){
					store.dispatch(Action.places.setActiveKeys(options.data));
				}
				break;
		}
	});
};

const activePlaceWatcher = (value, previousValue) => {
	console.log('@@ activePlaceWatcher', previousValue, '->', value);
	let extent;
	if (value){
		if (value.bbox && value.bbox.length){
			extent = value.bbox.split(',');
		} else if (value.geometry){
			extent = geoBounds(value.geometry);
		}
		if (!previousValue || (previousValue && (previousValue.key !== value.key))){
			window.Stores.notify('REDUX_SET_ACTIVE_PLACES', {keys: value.key, extents: extent});
		}
	}
};

const activePlacesWatcher = (value, previousValue) => {
	console.log('@@ activePlaceWatcher', previousValue, '->', value);
	let extents = [];
	let keys = [];
	if (value){
		value.map(place => {
			let extent;
			if (place.bbox && place.bbox.length){
				extent = place.bbox.split(',');
			} else if (place.geometry){
				extent = geoBounds(place.geometry);
			}
			extents.push(extent);
			keys.push(place.key);
		});
		if (!previousValue || (previousValue && !utils.collectionsAreEqual(value, previousValue, 'key'))){
			window.Stores.notify('REDUX_SET_ACTIVE_PLACES', {keys: keys, extents: extents});
		}
	}
};

const transform = model => {
	let {dataset, id, ...newModel} = model;
	newModel.key = model.id;
	newModel.scope = model.dataset;
	return newModel;
};

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
