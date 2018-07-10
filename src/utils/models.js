import React from 'react';
import _ from 'lodash';

/**
 * Remove from newModels such model, which already exists in oldModels (according to key)
 * @param oldModels {Array} collection of models
 * @param newModels {Array} collection of models
 * @returns {Array} collection of not-existing models
 */
export const removeDuplicities = (oldModels, newModels) => {
	let newModelsAdjusted = replaceIdWithKey(newModels);
	if (oldModels && oldModels.length){
		return _.reject(newModelsAdjusted, newModel => {
			return _.find(oldModels, {key: newModel.key});
		});
	} else {
		return newModelsAdjusted;
	}
};

/**
 * It replace id property with key property for each model
 * @param models {Array} collection of models
 * @returns {Array} collection of adjusted models
 */
export const replaceIdWithKey = (models) => {
	if (models.length){
		return models.map(layer => {
			let clone = _.cloneDeep(layer);
			clone.key = clone.key ? clone.key : (clone._id ? clone._id : clone.id);
			delete clone.id;
			delete clone._id;
			return clone;
		});
	} else {
		return models;
	}
};



