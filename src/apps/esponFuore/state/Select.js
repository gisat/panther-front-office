import CommonSelect from '../../../state/Select';
import esponFuoreIndicators from './EsponFuoreIndicators/selectors';
import esponFuoreSelections from './EsponFuoreSelections/selectors';
import {createSelector} from "reselect";
import _ from "lodash";
import ScopesSelectors from '../../../state/Scopes/selectors';
import TagsSelectors from '../../../state/Tags/selectors';

const getOrderedCategories = createSelector(
	[
		TagsSelectors.getIndexed,
		ScopesSelectors.getActiveScopeConfiguration
	],
	(tags, scopeConfig) => getOrderedByParameter(tags, scopeConfig, "categoryTagKeys")
);

const getOrderedSubcategories = createSelector(
	[
		TagsSelectors.getIndexed,
		ScopesSelectors.getActiveScopeConfiguration
	],
	(tags, scopeConfig) => getOrderedByParameter(tags, scopeConfig, "subCategoryTagKeys")
);

// helpers
function getOrderedByParameter(tags, scopeConfig, parameter) {
	if (tags && scopeConfig) {
		const order = scopeConfig.order && scopeConfig.order[parameter];
		if (order) {
			const uniqueKeysOrder = _.uniq(order);
			let orderedCategories = [];
			_.forEach(uniqueKeysOrder, categoryKey => {
				const category = _.find(tags, (tag) => tag.key === categoryKey);
				if (category) {
					orderedCategories.push(category);
				}
			});
			return orderedCategories;
		} else {
			return tags;
		}
	} else {
		return null;
	}
}

const esponFuore = {
	getOrderedCategories,
	getOrderedSubcategories
};

export default {
	...CommonSelect,
	specific: {
		esponFuore,
		esponFuoreIndicators,
		esponFuoreSelections
	}
}