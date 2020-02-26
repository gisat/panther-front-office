import _ from 'lodash';

import common from "../../_common/selectors";

const getSubstate = state => state.spatialVectorDataSources;

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);
const getByKey = common.getByKey(getSubstate);
const getBatchByFilterOrder = common.getBatchByFilterOrder(getSubstate);
const getDataByKey = common.getDataByKey(getSubstate);

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
	
	getBatchByFilterOrder,
	getSubstate,
	getEditedFeatures: getEditedFeatures,
	getAll,
	getAllAsObject,
	getByKey,
	getDataByKey,
};