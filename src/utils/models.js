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
			if (clone.id){
				delete clone.id;
			}
			if (clone._id){
				delete clone._id;
			}
			return clone;
		});
	} else {
		return models;
	}
};

/**
 * Filter scopes by current url
 * @param scopes {Array}
 * @param url {string}
 * @returns {Array}
 */
export const filterScopesByUrl = (scopes, url) => {
	if (scopes){
		return _.filter(scopes, (scope) => {
			return scope.urls && scope.urls.includes(url);
		});
	} else {
		return [];
	}
};



