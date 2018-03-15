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
	createWatcher(store, Select.maps.getPeriodIndependence, periodIndependenceWatcher, 'independentOfPeriod');

};

const setEventListeners = store => {

	window.Stores.addListener((event, options) => {
		switch(event) {
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
		}
	});

};

// ======== state watchers ========

const activeMapKeyWatcher = (value, previousValue) => {
	console.log('@@ activeMapKeyWatcher', previousValue, '->', value);
};

const mapsWatcher = (value, previousValue) => {
	console.log('@@ mapsWatcher', previousValue, '->', value);
};

const periodIndependenceWatcher = (value, previousValue) => {
	console.log('@@ periodIndependenceWatcher', previousValue, '->', value);
};

// ======== event listeners ========

const onPeriodsChanged = (store, options, initial) => {
	if (state.independentOfPeriod && (options.periods.length === 1)){
		store.dispatch(Action.maps.updateDefaults({period: options.periods[0]}));
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