import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";
import AttributesSelector from "../Attributes/selectors";


const getSubstate = state => state.attributeSets;

const getAll = common.getAll(getSubstate);
const getActiveKeys = common.getActiveKeys(getSubstate);
const getActive = common.getActive(getSubstate);

const getAttributesDataByActiveAttributeSets = createSelector(
	[getAll, getActiveKeys, AttributesSelector.getAttributes],
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
	[getAll, getActiveKeys],
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
	getActive,
	getActiveKeys,
	getAttributeSets: getAll,
	getAttributeKeysByActiveAttributeSets,
	getAttributesDataByActiveAttributeSets
};