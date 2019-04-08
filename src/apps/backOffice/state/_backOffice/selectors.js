import {createSelector} from "reselect";
import _ from 'lodash';
import commonHelpers from "../../../../state/_common/helpers";
import commonSelect from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";

import esponFuoreIndicators from "../../../esponFuore/state/EsponFuoreIndicators/selectors";

const activeAppKey = state => state.specific.apps.activeKey;

const getAllForActiveApp = (getSubstate) => {
	return createSelector(
		[commonSelectors.getAllAsObject(getSubstate), commonSelectors.getIndexes(getSubstate), activeAppKey, (state, order) => order],
		(models, indexes, activeAppKey, order) => {
			if (models && indexes) {
				let filter = null;
				if (activeAppKey) {
					filter = {
						applicationKey: activeAppKey
					}
				}
				let index = commonHelpers.getIndex(indexes, filter, order);
				if (index && index.index) {
					return getModelsByIndex(models, index.count, index.index);
				} else {
					return null;
				}
			} else {
				return null;
			}
		}
	);
};

const getAllWithOutdatedForActiveApp = (getSubstate) => {
	return createSelector(
		[commonSelectors.getAllAsObject(getSubstate), commonSelectors.getIndexes(getSubstate), activeAppKey, (state, order) => order],
		(models, indexes, activeAppKey, order) => {
			let data = {
				current: null,
				outdated: null
			};

			if (models && indexes) {
				let filter = null;
				if (activeAppKey) {
					filter = {
						applicationKey: activeAppKey
					}
				}
				let index = commonHelpers.getIndex(indexes, filter, order);

				if (index && index.index) {
					data.current = getModelsByIndex(models, index.count, index.index);
				}
				if (index && index.outdated) {
					data.outdated = getModelsByIndex(models, index.outdatedCount, index.outdated);
				}
			}

			return data;
		}
	);
};

// helpers
function getModelsByIndex(models, count, index) {
	let indexedModels = [];
	for (let i = 1; i <= count; i++){
		let modelKey = index[i];
		if (modelKey){
			let indexedModel = models[modelKey];
			if (indexedModel){
				indexedModels.push(indexedModel);
			} else {
				indexedModels.push({key: modelKey});
			}
		} else {
			indexedModels.push(null);
		}
	}
	return indexedModels.length ? indexedModels : null;
}

export default {
	attributes: {
		getAllForActiveApp: getAllForActiveApp(commonSelect.attributes.getSubstate)
	},
	layerTemplates: {
		getAllForActiveApp: getAllForActiveApp(commonSelect.layerTemplates.getSubstate),
		getAllWithOutdatedForActiveApp: getAllWithOutdatedForActiveApp(commonSelect.layerTemplates.getSubstate),
	},
	periods: {
		getAllForActiveApp: getAllForActiveApp(commonSelect.periods.getSubstate)
	},
	places: {
		getAllForActiveApp: getAllForActiveApp(commonSelect.places.getSubstate)
	},
	scopes: {
		getAllForActiveApp: getAllForActiveApp(commonSelect.scopes.getSubstate)
	},
	tags: {
		getAllForActiveApp: getAllForActiveApp(commonSelect.tags.getSubstate)
	},
	views: {
		getAllForActiveApp: getAllForActiveApp(commonSelect.views.getSubstate)
	},
}