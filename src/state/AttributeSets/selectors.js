import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";

const getSubstate = state => state.attributeSets;

const getAll = common.getAll(getSubstate);
const getActiveKeys = common.getActiveKeys(getSubstate);
const getActive = common.getActive(getSubstate);
const getStateToSave = common.getStateToSave(getSubstate);

const getByTopics = createSelector(
	[getAll, (state, topics) => topics],
	(attributeSets, topics) => {
		if (attributeSets && topics){
			if (!_.isArray(topics)) topics = [topics];
			let filtered = _.filter(attributeSets, (attributeSet) => {
				return _.includes(topics, attributeSet.data.topic);
			});
			return filtered.length ? filtered : null;
		} else {
			return null;
		}
	}
);

const getUniqueAttributeKeysForTopics = createSelector(
	[getByTopics],
	(attributeSets) => {
		if (attributeSets && attributeSets.length){
			let allAttributeKeys = attributeSets.map((attributeSet) => {
				return attributeSet.data.attributes;
			});
			let uniqueAttributeKeys = _.compact(_.uniq(_.flatten(allAttributeKeys)));
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

	getByTopics,
	getStateToSave,
	getUniqueAttributeKeysForTopics
};