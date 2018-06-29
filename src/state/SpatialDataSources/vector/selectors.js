import {createSelector} from 'reselect';
import _ from 'lodash';

const getEditedFeatures = state => state.spatialDataSources.vector.editedFeaturesBySourceKey;

const noMemoGetFeaturesBySourceKey = (state, props) => state.spatialDataSources.vector.featuresBySourceKey[props.dataSourceKey];
const noMemoGetEditedFeaturesBySourceKey = (state, props) => state.spatialDataSources.vector.editedFeaturesBySourceKey[props.dataSourceKey];
const noMemoGetSelectedFeaturesKeysBySourceKey = (state, props) => state.spatialDataSources.vector.selectedFeaturesKeysBySourceKey[props.dataSourceKey];

const noMemoGetSelectedFeaturesBySourceKey = (state, props) => {
		return _.filter(noMemoGetFeaturesBySourceKey(state, props), feature => {
			return _.includes(noMemoGetSelectedFeaturesKeysBySourceKey(state, props), feature.key);
		});
};


export default {
	noMemoGetFeaturesBySourceKey: noMemoGetFeaturesBySourceKey,
	noMemoGetEditedFeaturesBySourceKey: noMemoGetEditedFeaturesBySourceKey,
	noMemoGetSelectedFeaturesBySourceKey: noMemoGetSelectedFeaturesBySourceKey,
	getEditedFeatures: getEditedFeatures
};