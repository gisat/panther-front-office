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
				let oldModels = Select.places.getPlaces(store.getState());
				let newModels = utils.removeDuplicities(oldModels, _.map(options, transform));
				if (newModels && newModels.length){
					store.dispatch(Action.places.add(newModels));
				}
				break;
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
					if (scope.scenarios){
						store.dispatch(Action.scenarios.loadCases());
						let dispatchRelationsLoading = store.dispatch(Action.spatialRelations.load());

						// fix: sometimes dispatchRelationsLoading is undfined and I don't know why
						if (dispatchRelationsLoading){
							dispatchRelationsLoading.then(() => {
								let dataSourcesIds = Select.spatialRelations.getActivePlaceDataSourceIds(store.getState());
								if (dataSourcesIds && dataSourcesIds.length){
									store.dispatch(Action.spatialDataSources.loadFiltered({'key': dataSourcesIds}));
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
