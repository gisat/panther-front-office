import watch from 'redux-watch';
import Action from '../state/Action';
import Select from '../state/Select';
import _ from 'lodash';

let state = {};
let navigatorTimeout;

export default store => {

	setStoreWatchers(store);
	setEventListeners(store);

};

const setStoreWatchers = store => {

	createWatcher(store, Select.maps.getActiveMap, activeMapWatcher);
	createWatcher(store, Select.maps.getActiveMapKey, activeMapKeyWatcher);
	createWatcher(store, Select.maps.getMapKeys, mapKeysWatcher);
	createWatcher(store, Select.maps.getMaps, mapsWatcher, 'data');
	createWatcher(store, Select.maps.getMapDefaults, mapDefaultsWatcher);
	createWatcher(store, Select.maps.getPeriodIndependence, periodIndependenceWatcher, 'independentOfPeriod');

	createWatcher(store, Select.maps.getActivePlaceActiveLayers, activeLayersWatcher, 'activePlaceActiveLayers');

	createWatcher(store, Select.lpisCases.getActiveCase, ()=>{}, 'activeLpisCase');
	createWatcher(store, Select.scopes.getActiveScopeData, ()=>{}, 'activeScope');
	createWatcher(store, Select.places.getActive, ()=>{}, 'activePlace');
};

const setEventListeners = store => {

	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'map#selected':
				store.dispatch(Action.maps.setActive(options.id));
				break;
			case 'map#added':
				let map = convertWorldWindMapToMap(options);
				store.dispatch(Action.maps.add(map));

				if (map.scenarioKey){
					store.dispatch(Action.maps.updateWithScenarios())
				}

				break;
			case 'map#removed':
				store.dispatch(Action.maps.remove(options.id));
				break;
			case 'analyticalUnits#hide':
				store.dispatch(Action.maps.setAnalyticalUnitsVisibility(false));
				break;
			case 'analyticalUnits#show':
				store.dispatch(Action.maps.setAnalyticalUnitsVisibility(true));
				break;
			case 'periods#change':
				onPeriodsChanged(store, options);
				break;
			case 'periods#initial':
				onPeriodsChanged(store, options, true);
				break;
			case 'fo#mapIsIndependentOfPeriod':
				store.dispatch(Action.maps.handleMapDependencyOnPeriod(true));
				break;
			case 'fo#mapIsDependentOnPeriod':
				store.dispatch(Action.maps.handleMapDependencyOnPeriod(false));
				break;
			case 'layerPeriods#add':
				store.dispatch(Action.maps.selectLayerPeriod(options.layerKey, options.period, options.mapKey));
				break;
			case 'wmsLayer#add':
				store.dispatch(Action.maps.selectWmsLayer(options.layerKey, options.mapKey));
				break;
			case 'wmsLayer#remove':
				store.dispatch(Action.maps.clearWmsLayer(options.layerKey));
				break;
			case 'infoLayer#add':
				store.dispatch(Action.maps.addLayerTemplates(options.layerTemplates));
				break;
			case 'infoLayer#remove':
				store.dispatch(Action.maps.removeLayerTemplates(options.layerTemplates));
				break;
			case 'backgroundLayer#setActive':
				store.dispatch(Action.maps.setActiveBackgroundLayer(options.key));
				break;
			case 'placeGeometryChangeReview#showGeometry':
				store.dispatch(Action.maps.update({
					key: options.mapKey,
					placeGeometryChangeReview: {
						showGeometryBefore: options.showBefore,
						showGeometryAfter: options.showAfter
					}
				}));
				break;
			case 'navigator#update':
				if (navigatorTimeout){
					clearTimeout(navigatorTimeout);
				}
				navigatorTimeout = setTimeout(()=>{
					store.dispatch(Action.maps.updateNavigator({
						navigator: {
							lookAtLocation: options.lookAtLocation,
							range: options.range
						}
					}));
				},500);
				break;
            default:
                break;
		}
	});

};

// ======== state watchers ========

const activeMapWatcher = (value, previousValue) => {
	if (value){
		if (!state.lastActiveMapKey || state.lastActiveMapKey == value.key) {
			if (value.hasOwnProperty('placeGeometryChangeReview')) {
				if (value.placeGeometryChangeReview && value.placeGeometryChangeReview.showGeometryBefore != (previousValue.placeGeometryChangeReview && previousValue.placeGeometryChangeReview.showGeometryBefore)) {
					// show geometry before changed
					if (state.activeLpisCase && state.activeLpisCase.data && state.activeLpisCase.data.geometry_before){
						if (value.placeGeometryChangeReview.showGeometryBefore) {
							window.Stores.notify('PLACE_GEOMETRY_ADD', {
								mapKey: value.key,
								geometryKey: 'placeGeometryChangeReviewGeometryBefore',
								geometry: state.activeLpisCase.data.geometry_before
							});
						} else {
							window.Stores.notify('PLACE_GEOMETRY_REMOVE', {
								mapKey: value.key,
								geometryKey: 'placeGeometryChangeReviewGeometryBefore'
							});
						}
					}

					// for old lpis scope
					if (state.activePlace && state.activeScope && state.activeScope.featurePlaceChangeReview){
						if (value.placeGeometryChangeReview.showGeometryBefore) {
							window.Stores.notify('PLACE_GEOMETRY_ADD', {
								mapKey: value.key,
								geometryKey: 'placeGeometryChangeReviewGeometryBefore',
								geometry: state.activePlace.changeReviewGeometryBefore
							});
						} else {
							window.Stores.notify('PLACE_GEOMETRY_REMOVE', {
								mapKey: value.key,
								geometryKey: 'placeGeometryChangeReviewGeometryBefore'
							});
						}
					}
				}
				if (value.placeGeometryChangeReview && value.placeGeometryChangeReview.showGeometryAfter != (previousValue.placeGeometryChangeReview && previousValue.placeGeometryChangeReview.showGeometryAfter)) {
					// show geometry after changed
					if (state.activeLpisCase && state.activeLpisCase.data && state.activeLpisCase.data.geometry_after){
						if (value.placeGeometryChangeReview.showGeometryAfter) {
							window.Stores.notify('PLACE_GEOMETRY_ADD', {
								mapKey: value.key,
								geometryKey: 'placeGeometryChangeReviewGeometryAfter',
								geometry: state.activeLpisCase.data.geometry_after
							});
						} else {
							window.Stores.notify('PLACE_GEOMETRY_REMOVE', {
								mapKey: value.key,
								geometryKey: 'placeGeometryChangeReviewGeometryAfter'
							});
						}
					}

					// for old lpis scope
					if (state.activePlace && state.activeScope && state.activeScope.featurePlaceChangeReview){
						if (value.placeGeometryChangeReview.showGeometryAfter) {
							window.Stores.notify('PLACE_GEOMETRY_ADD', {
								mapKey: value.key,
								geometryKey: 'placeGeometryChangeReviewGeometryAfter',
								geometry: state.activePlace.changeReviewGeometryAfter
							});
						} else {
							window.Stores.notify('PLACE_GEOMETRY_REMOVE', {
								mapKey: value.key,
								geometryKey: 'placeGeometryChangeReviewGeometryAfter'
							});
						}
					}
				}
			}
		}
		state.lastActiveMapKey = value.key;
	}
};


const activeMapKeyWatcher = (value, previousValue) => {
	console.log('@@ activeMapKeyWatcher', previousValue, '->', value);
};

const mapsWatcher = (value, previousValue) => {
	console.log('@@ mapsWatcher', previousValue, '->', value);
	_.each(value, map => {
		let previousMap = _.find(previousValue, {key: map.key});
		if (previousMap) {
			let diff = compare(map.layerPeriods, previousMap.layerPeriods);
			let diffWmsLayers = compareValues(map.wmsLayers, previousMap.wmsLayers);
			let diffName = compareName(map.name, previousMap.name);

			console.log('@@ diff', diff);
			_.each(diff.added, (value, key) => {
				window.Stores.notify('ADD_WMS_LAYER', {
					mapKey: map.key,
					layerKey: Number(key),
					period: value
				});
			});
			_.each(diff.changed, (value, key) => {
				window.Stores.notify('REMOVE_WMS_LAYER', {
					mapKey: map.key,
					layerKey: Number(key)
				});
				if (value){
					window.Stores.notify('ADD_WMS_LAYER', {
						mapKey: map.key,
						layerKey: Number(key),
						period: value
					});
				}
			});
			_.each(diff.removed, (value, key) => {
				window.Stores.notify('REMOVE_WMS_LAYER', {
					mapKey: map.key,
					layerKey: Number(key)
				});
			});

			console.log('@@ diffWmsLayers', diffWmsLayers);
			_.each(diffWmsLayers.added, (value) => {
				window.Stores.notify('ADD_WMS_LAYER', {
					layerKey: value,
					mapKey: map.key
				});
			});
			_.each(diffWmsLayers.removed, (value) => {
				window.Stores.notify('REMOVE_WMS_LAYER', {
					layerKey: value,
					mapKey: map.key
				});
			});

			console.log('@@ diffName', diffName);
			if (diffName){
				window.Stores.notify('CHANGE_MAP_NAME', {
					mapKey: map.key,
					name: map.name
				});
			}
		} else {
			// new map added
		}
	});
	window.Stores.notify('REDUX_STORE_MAPS_CHANGED', {maps: value});
};

const mapDefaultsWatcher = (value, previousValue) => {
	console.log('@@ mapDefualtsWatcher', previousValue, '->', value);
	window.Stores.notify('REDUX_STORE_MAPS_CHANGED', {defaults: value});
};

const periodIndependenceWatcher = (value, previousValue) => {
	console.log('@@ periodIndependenceWatcher', previousValue, '->', value);
};

const activeLayersWatcher = (value, previousValue) => {
	console.log('@@## activeLayersWatcher', previousValue, '->', value);
	let diffLayers = compareCollections(value, previousValue, 'key');
	console.log('@@## diffLayers', diffLayers);
	if (diffLayers.removed && diffLayers.removed.length){
		window.Stores.notify('REMOVE_INFO_LAYERS_BY_SCENARIOS', diffLayers.removed);
	}
	if (diffLayers.added && diffLayers.added.length){
		window.Stores.notify('ADD_INFO_LAYERS_BY_SCENARIOS', diffLayers.added);
	}
};

const mapKeysWatcher = (value, previousValue) => {
	console.log('@@## mapKeysWatcher', previousValue, '->', value);
	let diffMapKeys = compareValues(value, previousValue);
	console.log('@@## diffLayers', diffMapKeys );
	if (diffMapKeys.added && diffMapKeys.added.length && state.activePlaceActiveLayers  && state.activePlaceActiveLayers.length){
		let data = state.activePlaceActiveLayers;
		window.Stores.notify('ADD_INFO_LAYERS_BY_SCENARIOS', data);
	}
};

// ======== event listeners ========

const onPeriodsChanged = (store, options, initial) => {
	if (state.independentOfPeriod && (options.length === 1)){
		store.dispatch(Action.maps.updateDefaults({period: options[0]}));
	} else if (initial) {
		if (options && options.length && state.data.length){
			store.dispatch(Action.maps.update({
				key: state.data[0]['key'],
				period: options[0]
			}));
		}
	}
};

// ======== helpers ========

const convertWorldWindMapToMap = (options) => {
	let map = options.map;

	let data = {
		key: map._id,
		name: map._name
	};
	if (map._period && !state.independentOfPeriod){
		data['period'] = map._period;
	}
	if (map.scenarioKey){
		data['scenarioKey'] = map.scenarioKey;
		data['dataLoading'] = true;
	}

	return data;
};

const compareCollections = (next, prev, key) => {
	if (prev) {
		let ret = {
			added: [],
			removed: []
		};
		next.map(object => {
			let exist = _.find(prev, (prevObject) => {return prevObject[key] === object[key]});
			if (!exist){
				ret.added.push(object);
			}
		});

		prev.map(object => {
			let exist = _.find(next, (nextObject) => {return nextObject[key] === object[key]});
			if (!exist){
				ret.removed.push(object);
			}
		});

		return ret;
	} else {
		return {
			added: next
		};
	}
};

const compareValues = (next, prev) => {
	if (prev) {
		let nextLayers = [];
		if (_.isArray(next)){
			nextLayers = next;
		}
		return {
			added: _.difference(nextLayers, prev),
			removed: _.difference(prev, nextLayers)
		};
	} else {
		return {
			added: next
		};
	}
};

const compare = (next, prev) => {
	if (prev) {
		let ret = {
			added: {},
			removed: {},
			changed: {}
		};
		_.each(next, (value, key) => {
			if (!prev.hasOwnProperty(key)) {
				ret.added[key] = value;
			} else if (prev[key] !== value) {
				ret.changed[key] = value;
			}
		});
		_.each(prev, (value, key) => {
			if (!next || !next.hasOwnProperty(key)) {
				ret.removed[key] = value;
			}
		});
		return ret;
	} else {
		return {
			added: next
		};
	}
};

const compareName = (next, prev) => {
	return !prev || (prev !== next);
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

