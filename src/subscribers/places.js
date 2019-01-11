import _ from 'lodash';
import watch from "redux-watch";
import {geoBounds} from 'd3-geo';

import Action from '../state/Action';
import utils from '../utils/utils';
import Select from "../state/Select";
import common from "./_common";

let state = {};

export default store => {
	setEventListeners(store);
	setStoreWatchers(store);
};

const setStoreWatchers = store => {
	common.createWatcher(store, Select.places.getAllForDataviewAsObject, byKeyWatcher, 'byKeyForDataview');
	common.createWatcher(store, Select.places.getActive, activePlaceWatcher);
	common.createWatcher(store, Select.places.getActivePlaces, activePlacesWatcher);
};


const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			default:
				break;
		}
	});
};

const activePlaceWatcher = (value, previousValue) => {
	console.log('@@ activePlaceWatcher', previousValue, '->', value);
	let extent;
	if (value && value.data){
		if (value.data.bbox && value.data.bbox.length){
			extent = value.data.bbox.split(',');
		} else if (value.data.geometry){
			extent = geoBounds(value.data.geometry);
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
			if (place.data.bbox && place.data.bbox.length){
				extent = place.data.bbox.split(',');
			} else if (place.data.geometry){
				extent = geoBounds(place.data.geometry);
			}
			extents.push(extent);
			keys.push(place.key);
		});
		if (!previousValue || (previousValue && !utils.collectionsAreEqual(value, previousValue, 'key'))){
			window.Stores.notify('REDUX_SET_ACTIVE_PLACES', {keys: keys, extents: extents});
		}
	}
};

// ======== state watchers ========
const byKeyWatcher = (value, previousValue, stateKey) => {
	console.log('@@@@@ subscribers/places#byKeyWatcher', previousValue, '->', value);
	if (stateKey) state[stateKey] = value;
	let diff = common.compareByKey(value, previousValue);

	// todo changed and removed?
	if (diff.added && diff.added.length){
		window.Stores.notify("REDUX_PLACES_ADD", diff.added);
	}
};
