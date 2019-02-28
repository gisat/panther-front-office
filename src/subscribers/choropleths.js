import Action from '../state/Action';
import watch from "redux-watch";
import Select from "../state/Select";
import _ from "lodash";


let state = {};
export default store => {
	setStoreWatchers(store);
	setEventListeners(store);
};

const setStoreWatchers = store => {
	createWatcher(store, Select.choropleths.getActiveKeys, activeKeysWatcher);
	createWatcher(store, Select.choropleths.getActiveChoroplethsForMaps, activeChoroplethsWatcher);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {
			case 'choropleths#update':
				store.dispatch(Action.choropleths.updateChoropleth(options));
				break;
			case 'choropleths#addActive':
				store.dispatch(Action.choropleths.addActiveKeys(options));
				break;
			case 'choropleths#removeActive':
				store.dispatch(Action.choropleths.removeActiveKeys(options));
				break;
			case 'choropleths#setActive':
				store.dispatch(Action.choropleths.setActiveKeys(options));
				break;
			default:
				break;
		}
	});
};


const activeChoroplethsWatcher = (value, previousValue) => {
	console.log('@@## activeChoroplethsWatcher', previousValue, '->', value);
	let diffChoropleths = compareChoropleths(value, previousValue);
	console.log('@@## diffChoropleths', diffChoropleths);
	if (diffChoropleths && diffChoropleths.added){
		_.forIn(diffChoropleths.added, (choropleth) => {
			window.Stores.notify("CHOROPLETH_ADD", choropleth)
		});
	}
	if (diffChoropleths && diffChoropleths.removed){
		_.forIn(diffChoropleths.removed, (choropleth) => {
			window.Stores.notify("CHOROPLETH_REMOVE", choropleth)
		});
	}
	if (diffChoropleths && diffChoropleths.changed){
		_.forIn(diffChoropleths.changed, (choropleth) => {
			window.Stores.notify("CHOROPLETH_CHANGE", choropleth)
		});
	}
};

const activeKeysWatcher = (value, previousValue) => {
	console.log('@@## activeChoroplethKeysWatcher', previousValue, '->', value);
	window.Stores.notify("CHOROPLETH_ACTIVE_KEYS_CHANGED", value);
	let diffChoroplethKeys = compareValues(value, previousValue);
	console.log('@@## diffChoroplethKeys', diffChoroplethKeys);
	if (diffChoroplethKeys && diffChoroplethKeys.added){
		window.Stores.notify("CHOROPLETH_CHECK_CHANGED", diffChoroplethKeys);
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

const compareChoropleths = (next, prev) => {
	if (prev) {
		let ret = {
			added: {},
			removed: {},
			changed: {}
		};

		_.forIn(prev, (value, key) => {
			let nextChoropleth = next ? next[key] : null;
			if (!nextChoropleth){
				ret.removed[key] = value;
			}
		});

		_.forIn(next, (value, key) => {
			let previousChoropleth = prev[key];
			if (!previousChoropleth){
				ret.added[key] = value;
			} else {
				let previousSldId = previousChoropleth.data ? previousChoropleth.data.sldId : null;
				let nextSldId = value.data ? value.data.sldId : null;
				if (!previousSldId){
					ret.added[key] = value;
				} else if (previousSldId !== nextSldId){
					ret.changed[key] = value;
				}
			}
		});
		return ret;
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
