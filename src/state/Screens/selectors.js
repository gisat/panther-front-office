import _ from 'lodash';
import {createSelector} from 'reselect';

const getAllScreensAsObject = state => state.screens.screens;
const getAllSetsAsObject = state => state.screens.sets;

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
	getSetKeyByScreenLineage
}