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

	createWatcher(store, Select.places.getActive, activePlaceWatcher);
	createWatcher(store, Select.places.getActivePlaces, activePlacesWatcher);
};


const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'place#setActivePlace':
				let scope = Select.scopes.getActiveScopeData(store.getState());
				let place = null;
				let places = null;

				if (typeof options.data === "number"){
					place = options.data;
				} else if (options.data.length && options.data.length === 1){
					place = options.data[0];
				} else if (options.data.length && options.data.length > 1){
					places = options.data;
				}

				if (place && (!state.previousPlace || state.previousPlace !== place)){
					state.previousPlace = place;
					store.dispatch(Action.places.setActive(place));

					// if scope has scenario property: load scenario cases, spatial relations and then spatial data sources
					if (scope.data && scope.data.scenarios){
						store.dispatch(Action.scenarios.loadCases());
						let dispatchRelationsLoading = store.dispatch(Action.spatialRelations.load());

						// fix: sometimes dispatchRelationsLoading is undfined and I don't know why
						if (dispatchRelationsLoading){
							dispatchRelationsLoading.then(() => {
								let dataSourcesIds = Select.spatialRelations.getActivePlaceDataSourceIds(store.getState());
								if (dataSourcesIds && dataSourcesIds.length){
									store.dispatch(Action.spatialDataSources.loadFiltered({'id': dataSourcesIds}));
								}
							});
						}
					}
				} else if (places){
					store.dispatch(Action.places.setActiveKeys(places));
				}
				break;
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

const transform = model => {
	let {dataset, id, ...newModel} = model;
	newModel.key = model.id;
	newModel.scope = model.dataset;
	return newModel;
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
