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
			case "ActiveViewLoaded":
				store
					.dispatch(Action.lpisCases.loadCaseForActiveView())
					.then(() => {
						return store.dispatch(Action.lpisCases.setActiveCaseByActiveView());
					}).then(() => {
						let activeCase = Select.lpisCases.getActiveCase(store.getState());
						let maps = Select.maps.getMaps(store.getState());
						if (activeCase && maps && maps.length > 1){
							addGeometries(activeCase, maps);
						}
				});
				break;
		}
	});
};

const addGeometries = function(activeCase, maps){
	maps.map(map => {
		if (map.placeGeometryChangeReview && map.placeGeometryChangeReview.showGeometryBefore){
			window.Stores.notify('PLACE_GEOMETRY_ADD', {
				mapKey: map.key,
				geometryKey: 'placeGeometryChangeReviewGeometryBefore',
				geometry: activeCase.data.geometry_before
			});
		}
		if (map.placeGeometryChangeReview && map.placeGeometryChangeReview.showGeometryAfter){
			window.Stores.notify('PLACE_GEOMETRY_ADD', {
				mapKey: map.key,
				geometryKey: 'placeGeometryChangeReviewGeometryAfter',
				geometry: activeCase.data.geometry_after
			});
		}
	});
};

// ======== state watchers ========
const dataForInitialLoadWatcher = (value) => {
	console.log('@@@@@ subscribers/scopes#getDataForInitialLoad', value);
	if (value && !legacyCodeInitialized){
		let allStoresLoaded = true;
		_.forIn(value, (models) => {
			if (!models){
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