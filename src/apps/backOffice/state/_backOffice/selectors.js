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

const getForMetadataModel = (getSubstate, type, category) => {
	let getDataByKeySelector;
	let getEditedDataByKeySelector;
	if (category) {
		if (category === "specific" && type === "esponFuoreIndicators")
		getDataByKeySelector = esponFuoreIndicators.getDataByKey;
		getEditedDataByKeySelector = esponFuoreIndicators.getEditedDataByKey;
	} else {
		getDataByKeySelector = commonSelect[type].getDataByKey;
		getEditedDataByKeySelector = commonSelect[type].getEditedDataByKey;
	}

	return createSelector(
		[
			commonSelectors.getAllAsObject(getSubstate),
			getDataByKeySelector,
			getEditedDataByKeySelector,
			(state, key, columnKey) => columnKey
		],
		(models, indicatorData, editedIndicatorData, columnKey) => {
			if (models && !_.isEmpty(models) && (indicatorData && indicatorData[columnKey] || editedIndicatorData && editedIndicatorData[columnKey])) {
				let keys = indicatorData && indicatorData[columnKey];
				if (editedIndicatorData && editedIndicatorData[columnKey]) {
					keys = editedIndicatorData[columnKey]
				}

				if (_.isArray(keys)) {
					return  _.filter(models, (model) => {
						return _.includes(keys, model.key);
					});
				} else {
					return  _.filter(models, (model) => {
						return keys === model.key;
					});
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
		getAllForActiveApp: getAllForActiveApp(commonSelect.tags.getSubstate),
		getForEsponFuoreIndicators: getForMetadataModel(commonSelect.tags.getSubstate, 'esponFuoreIndicators', 'specific')
	},
	views: {
		getAllForActiveApp: getAllForActiveApp(commonSelect.views.getSubstate)
	},
}