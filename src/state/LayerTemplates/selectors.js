import {createSelector} from 'reselect';
import _ from 'lodash';

const getTemplates = state => state.layerTemplates.data;

export default {
	getTemplates: getTemplates
};