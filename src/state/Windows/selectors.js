import _ from 'lodash';
import {createSelector} from 'reselect';

const getAllSetsAsObject = state => state.windows.sets;
const getAllWindowsAsObject = state => state.windows.windows;

const getSetByKey = createSelector(
	[
		getAllSetsAsObject,
		(state, key) => key
	],
	(sets, key) => {
		return sets && sets[key];
	}
);

const getWindow = createSelector(
	[
		getAllWindowsAsObject,
		(state, key) => key
	],
	(windows, key) => {
		return windows && windows[key];
	}
);

const getWindowsBySetKeyAsObject = createSelector(
	[
		getSetByKey,
		getAllWindowsAsObject
	],
	(set, windows) => {
		if (set && set.orderByHistory && set.orderByHistory.length) {
			let setWindows = {};
			_.each(set.orderByHistory, (key) => {
				setWindows[key] = windows[key];
			});
			return setWindows;
		} else {
			return null;
		}
	}
);

const isOpen = createSelector(
	[getWindow],
	(window) => {
		return window && window.data && window.data.state === 'open';
	}
);

export default {
	getSetByKey,
	getWindow,
	getWindowsBySetKeyAsObject,
	isOpen
}