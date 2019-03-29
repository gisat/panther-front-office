import {createSelector} from "reselect";
import commonHelpers from "../../../../state/_common/helpers";
import commonSelect from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";

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
					let indexedModels = [];
					for (let i = 1; i <= index.count; i++){
						let modelKey = index.index[i];
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
				} else {
					return null;
				}
			} else {
				return null;
			}
		}
	);
};

export default {
	attributes: {
		getAllForActiveApp: getAllForActiveApp(commonSelect.attributes.getSubstate)
	},
	layerTemplates: {
		getAllForActiveApp: getAllForActiveApp(commonSelect.layerTemplates.getSubstate)
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
}