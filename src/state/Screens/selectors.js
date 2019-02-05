import _ from 'lodash';
import {createSelector} from 'reselect';

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

export default {
	getSetKeyByScreenLineage
}