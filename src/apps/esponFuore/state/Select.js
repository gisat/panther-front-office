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
	(tags, scopeConfig) => getOrderedModelsByConfigParameter(tags, scopeConfig, "categoryTagKeys")
);

const getOrderedIndicators = createSelector(
	[
		esponFuoreIndicators.getIndexed,
		ScopesSelectors.getActiveScopeConfiguration
	],
	(tags, scopeConfig) => getOrderedModelsByConfigParameter(tags, scopeConfig, "indicatorKeys")
);

const getOrderedSubcategories = createSelector(
	[
		TagsSelectors.getIndexed,
		ScopesSelectors.getActiveScopeConfiguration
	],
	(tags, scopeConfig) => getOrderedModelsByConfigParameter(tags, scopeConfig, "subCategoryTagKeys")
);

// helpers
function getOrderedModelsByConfigParameter(models, config, parameter) {
	if (models && config) {
		const order = config.order && config.order[parameter];
		if (order) {
			const uniqueKeysOrder = _.uniq(order);
			let orderedModels = [];
			_.forEach(uniqueKeysOrder, categoryKey => {
				const category = _.find(models, (tag) => tag.key === categoryKey);
				if (category) {
					orderedModels.push(category);
				}
			});
			return orderedModels;
		} else {
			return models;
		}
	} else {
		return null;
	}
}

const esponFuore = {
	getOrderedCategories,
	getOrderedIndicators,
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