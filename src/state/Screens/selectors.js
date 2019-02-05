import _ from 'lodash';
import {createSelector} from 'reselect';

const getAllScreensAsObject = state => state.screens.screens;
const getAllSetsAsObject = state => state.screens.sets;

const getSetByKey = createSelector(
	[
		getAllSetsAsObject,
		(state, key) => key
	],
	(sets, key) => {
		if (sets && !_.isEmpty(sets) && key && sets[key]) {
			return sets[key];
		} else {
			return null;
		}
	}
);

const getScreensBySetKey = createSelector(
	[
		getSetByKey,
		getAllScreensAsObject
	],
	(set, screens) => {
		if (set) {
			let setScreens = {};
			_.each(set.orderBySpace, (lineage) => {
				setScreens[lineage] = screens[lineage];
			});
			return setScreens;
		} else {
			return null;
		}
	}
);

/**
 * @param state {Object}
 * @param screenLineage {string}
 */
const getSetKeyByScreenLineage = createSelector(
	[
		getAllSetsAsObject,
		(state, screenLineage) => screenLineage
	],
	/**
	 * @param sets {Object} all sets as object
	 * @param lineage {string}
	 * @return {string | null} screen set key
	 */
	(sets, lineage) => {
		let setKey = null;

		_.forIn(sets, (value, key) => {
			if (_.includes(value.orderByHistory, lineage)) {
				setKey = key;
			}
		});

		return setKey;
	}
);

/**
 * @param state {Object}
 * @param screenLineage {string}
 */
const getScreenByLineage = createSelector(
	[
		getAllScreensAsObject,
		(state, lineage) => (lineage)
	],
	/**
	 * @param screens {object} all screens as object
	 * @param lineage {string}
	 * @return {Object | null} screen
	 */
	(screens, lineage) => {
		if (screens && !_.isEmpty(screens) && lineage && screens[lineage]) {
			return screens[lineage];
		} else {
			return null;
		}
	}
);

export default {
	getScreenByLineage,
	getScreensBySetKey,
	getSetByKey,
	getSetKeyByScreenLineage
}