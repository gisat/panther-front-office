import watch from "redux-watch";
import _ from "lodash";


// ======= create watcher =========
const createWatcher = (store, selector, watcher, stateKey) => {
	if (stateKey) {
		store.subscribe(watch(() => selector(store.getState()))((value, previousValue) => {
			watcher(value, previousValue, stateKey);
		}));
	} else {
		store.subscribe(watch(() => selector(store.getState()))(watcher));
	}
};

// ======= comparators ============
const compareByKey = (next, prev) => {
	if (prev) {
		let ret = {
			added: [],
			removed: [],
			changed: []
		};

		_.forIn(prev, (value, key) => {
			let nextModel = next ? next[key] : null;
			if (!nextModel){
				ret.removed.push(value);
			}
		});

		_.forIn(next, (value, key) => {
			let previousModel = prev[key];
			if (!previousModel){
				ret.added.push(value);
			} else if (previousModel && !_.isEqual(previousModel, value)) {
				ret.changed.push(value)

			}
		});
		return ret;
	} else {
		return {
			added: Object.values(next)
		};
	}
};

export default {
	compareByKey,

	createWatcher
}