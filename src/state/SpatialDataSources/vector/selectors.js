import {createSelector} from 'reselect';
import _ from 'lodash';

const getFeatures = (state) => state.spatialDataSources.vector.features;
const getEditedFeatures = (state) => state.spatialDataSources.vector.editedFeatures;


export default {
	getFeatures: getFeatures,
	getEditedFeatures: getEditedFeatures
};