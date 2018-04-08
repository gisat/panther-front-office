import watch from 'redux-watch';
import Action from '../state/Action';
import Select from '../state/Select';
import _ from 'lodash';

let state = {};

export default store => {

	setStoreWatchers(store);
	setEventListeners(store);

};

const setStoreWatchers = store => {

	createWatcher(store, Select.maps.getActiveMapKey, activeMapKeyWatcher);
	createWatcher(store, Select.maps.getMaps, mapsWatcher, 'data');
	createWatcher(store, Select.maps.getMapDefaults, mapDefaultsWatcher);
	createWatcher(store, Select.maps.getPeriodIndependence, periodIndependenceWatcher, 'independentOfPeriod');

};

const setEventListeners = store => {

	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'backgroundLayer#add':
				store.dispatch(Action.maps.addDistinctBackgroundLayer(options.key));
				break;
			case 'map#selected':
				store.dispatch(Action.maps.setActive(options.id));
				break;
			case 'map#defaultMapUnselected':
				store.dispatch(Action.maps.setActive(null));
				break;
			case 'map#added':
				store.dispatch(Action.maps.add(convertWorldWindMapToMap(options.map)));
				break;
			case 'map#removed':
				store.dispatch(Action.maps.remove(options.id));
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
		}
	});

};

// ======== state watchers ========

const activeMapKeyWatcher = (value, previousValue) => {
	console.log('@@ activeMapKeyWatcher', previousValue, '->', value);
};

const mapsWatcher = (value, previousValue) => {
	console.log('@@ mapsWatcher', previousValue, '->', value);
	_.each(value, map => {
		let previousMap = _.find(previousValue, {key: map.key});
		if (previousMap) {
			let diff = compare(map.layerPeriods, previousMap.layerPeriods);
			let diffWmsLayers = compareWmsLayers(map.wmsLayers, previousMap.wmsLayers);
			console.log('@@ diff', diff);
			_.each(diff.added, (value, key) => {
				window.Stores.notify('ADD_WMS_LAYER', {
					mapKey: map.key,
					layerKey: key,
					period: value
				});
			});
			_.each(diff.changed, (value, key) => {
				window.Stores.notify('REMOVE_WMS_LAYER', {
					mapKey: map.key,
					layerKey: key
				});
				if (value){
					window.Stores.notify('ADD_WMS_LAYER', {
						mapKey: map.key,
						layerKey: key,
						period: value
					});
				}
			});
			_.each(diff.removed, (value, key) => {
				window.Stores.notify('REMOVE_WMS_LAYER', {
					mapKey: map.key,
					layerKey: key
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

const convertWorldWindMapToMap = (map) => {
	let data = {
		key: map._id,
		name: map._name
	};
	if (map._period && !state.independentOfPeriod){
		data['period'] = map._period
	}

	return data;
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
			} else if (prev[key] != value) {
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

const compareWmsLayers = (next, prev) => {
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