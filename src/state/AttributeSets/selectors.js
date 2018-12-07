import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";
import AttributesSelector from "../Attributes/selectors";
import ThemesSelectors from "../_Themes/selectors";


const getSubstate = state => state.attributeSets;

const getAll = common.getAll(getSubstate);
const getActiveKeys = common.getActiveKeys(getSubstate);
const getActive = common.getActive(getSubstate);
const getActiveModels = common.getActiveModels(getSubstate);
const getAllForDataview = common.getAllForDataview(getSubstate);
const getAllForDataviewAsObject = common.getAllForDataviewAsObject(getSubstate);

const isInitializedForExt = common.isInitializedForExt(getSubstate);

// TODO create tests
const getByActiveThemeTopics = createSelector(
	[getAll, ThemesSelectors.getActive],
	(attributeSets, activeTheme) => {
		if (attributeSets && activeTheme){
			return _.filter(attributeSets, (attributeSet) => {
				return _.includes(activeTheme.data.topics, attributeSet.data.topic);
			});
		} else {
			return null;
		}
	}
);

// TODO create tests
const getUniqueAttributeKeysForActiveTheme = createSelector(
	[getByActiveThemeTopics],
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

const getAttributeKeysForActive =createSelector(
	[getActiveModels],
	(models) => {
		let attributeKeys = [];
		if (models){
			models.forEach(model => {
				let attributes = model.data.attributes;
				if (attributes){
					attributeKeys = attributeKeys.concat(attributes);
				}
			});
		}
		return attributeKeys.length ? attributeKeys : null;
	}
);

export default {
	getActive,
	getActiveKeys,
	getAttributeSets: getAll,

	getAllForDataview,
	getAllForDataviewAsObject,

	getAttributeKeysForActive,

	getUniqueAttributeKeysForActiveTheme,

	isInitializedForExt
};