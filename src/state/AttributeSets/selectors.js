import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";

const getSubstate = state => state.attributeSets;

const getAll = common.getAll(getSubstate);
const getActiveKeys = common.getActiveKeys(getSubstate);
const getActive = common.getActive(getSubstate);
const getAllForDataview = common.getAllForDataview(getSubstate);
const getAllForDataviewAsObject = common.getAllForDataviewAsObject(getSubstate);

const isInitializedForExt = common.isInitializedForExt(getSubstate);

const getByTopics = createSelector(
	[getAll, (state, topics) => topics],
	(attributeSets, topics) => {
		if (attributeSets && topics){
			return _.filter(attributeSets, (attributeSet) => {
				return _.includes(topics, attributeSet.data.topic);
			});
		} else {
			return null;
		}
	}
);

// TODO create tests
const getUniqueAttributeKeysForTopics = createSelector(
	[getByTopics],
	(attributeSets) => {
		if (attributeSets && attributeSets.length){
			let allAttributeKeys = attributeSets.map((attributeSet) => {
				return attributeSet.data.attributes;
			});
			let uniqueAttributeKeys = _.uniq(_.flatten(allAttributeKeys));
			return uniqueAttributeKeys.length ? uniqueAttributeKeys : null;

		} else {
			return null;
		}
	}
);

export default {
	getActive,
	getActiveKeys,
	getAttributeSets: getAll,

	getAllForDataview,
	getAllForDataviewAsObject,

	getUniqueAttributeKeysForTopics,

	isInitializedForExt
};