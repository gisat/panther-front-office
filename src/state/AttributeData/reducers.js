import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/reducers';
import _ from 'lodash';

import {DEFAULT_INITIAL_STATE} from "../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

// Add should be actually update, because dataSourceKey is used as key
const update = (state, action) => {
	let newData = {...state.byKey};
	if (action.data && action.data.length) {
		action.data.forEach(model => {
			let previousData = newData[model.attributeDataSourceKey];
			if (previousData) {
				const fidColumnName = action.filter.fidColumnName;
				const previousFeatures = previousData.attributeData.features;
				const nextFeatures = model.attributeData.features;

				let newFeaturesAsObject = {};
				_.forEach(previousFeatures, (feature) => {
					newFeaturesAsObject[feature.properties[fidColumnName]] = feature;
				});

				_.forEach(nextFeatures, feature => {
					const key = feature.properties[fidColumnName];
					newFeaturesAsObject[key] = feature;
				});

				newData[model.attributeDataSourceKey] = {
					...newData[model.attributeDataSourceKey],
					attributeData: {
						...newData[model.attributeDataSourceKey].attributeData,
						features: Object.values(newFeaturesAsObject)
					}
				}

			} else {
				newData[model.attributeDataSourceKey] = model;
			}
		});
	}
	return {...state, byKey: newData}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.ATTRIBUTE_DATA.ADD:
			return update(state, action);
		case ActionTypes.ATTRIBUTE_DATA.ADD_BATCH:
			return common.addBatch(state, action);
		case ActionTypes.ATTRIBUTE_DATA.ADD_UNRECEIVED:
			return common.addUnreceivedKeys(state, action);
		case ActionTypes.ATTRIBUTE_DATA.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.ATTRIBUTE_DATA.INDEX.ADD_BATCH:
			return common.addBatchIndex(state, action);
		case ActionTypes.ATTRIBUTE_DATA.USE.INDEXED.REGISTER:
			return common.registerUseIndexed(state, action);
		case ActionTypes.ATTRIBUTE_DATA.USE.INDEXED_BATCH.REGISTER:
			return common.registerBatchUseIndexed(state, action);
		case ActionTypes.ATTRIBUTE_DATA.USE.INDEXED.CLEAR:
			return common.useIndexedClear(state, action);

		default:
			return state;
	}
}