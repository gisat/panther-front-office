import {createSelector} from 'reselect';
import _ from 'lodash';

const getActiveKeys = state => state.attributeSets.activeKeys;
const getAttributeSets = state => state.attributeSets.data;
const getAttributes = state => state.attributes.data;

const getActive = createSelector(
	[getAttributeSets, getActiveKeys],
	(models, keys) => {
		return _.filter(models, model => {
			return _.find(keys, key => {
				return key === model.key;
			});
		});
	}
);

const getAttributesDataByActiveAttributeSets = createSelector(
	[getAttributeSets, getActiveKeys, getAttributes],
	(models, keys, attributesData) => {
		let attributeSets = {};
		_.filter(models, model => {
			let attributeSetKey = _.find(keys, key => {
				return key === model.key;
			});
			if (attributeSetKey){
				let attributes = [];
				model.attributes.map(attributeKey => {
					attributes.push(_.find(attributesData, attributeModel => {
						return attributeModel.key = attributeKey;
					}));
				});
				attributeSets[attributeSetKey] = {
					attributes: attributes
				}
			}
		});
		return attributeSets;
	}
);

const getAttributeKeysByActiveAttributeSets = createSelector(
	[getAttributeSets, getActiveKeys],
	(models, keys) => {
		let attributeSets = {};
		_.filter(models, model => {
			let attributeSetKey = _.find(keys, key => {
				return key === model.key;
			});
			if (attributeSetKey){
				attributeSets[attributeSetKey] = {
					attributes: model.attributes
				}
			}
		});
		return attributeSets;
	}
);

export default {
	getActive: getActive,
	getActiveKeys: getActiveKeys,

	getAttributeSets: getAttributeSets,

	getAttributeKeysByActiveAttributeSets: getAttributeKeysByActiveAttributeSets,
	getAttributesDataByActiveAttributeSets: getAttributesDataByActiveAttributeSets
};