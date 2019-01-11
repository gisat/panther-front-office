import Select from '../state/Select';
import common from "./_common";
import _ from "lodash";
import loadApp from "../app-old";

export default store => {
	setEventListeners(store);
	setStoreWatchers(store);
};

const setStoreWatchers = store => {
	common.createWatcher(store, Select.users.getActive, activeUserWatcher);
};

const setEventListeners = store => {
	window.Stores.addListener((event, options) => {
		switch(event) {

		}
	});
};

// ======== state watchers ========
const activeUserWatcher = (value, previousValue) => {
	console.log('@@ activeUserWatcher', previousValue, '->', value);
	if (value && (!previousValue || (previousValue !== value))){
		window.Stores.notify('user#changed', {
			isLoggedIn: value.key && value.key > 0,
			isAdmin: !!(_.find(value.groups, {key: 1})),
			groups: value.groups
		});
	}
};