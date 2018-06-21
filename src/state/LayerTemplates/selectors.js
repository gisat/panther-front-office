import {createSelector} from 'reselect';
import _ from 'lodash';

const getTemplates = state => state.layerTemplates.data;

const getSymbologies = state => state.symbologies.data;

const getTemplate = createSelector(
	[getTemplates, (state, key) => (key)],
	(templates, templateKey) => {
		return templateKey ? _.find(templates, {key: templateKey}) : null;
	}
);

const getSymbologiesForTemplate = createSelector(
	[getTemplate, getSymbologies],
	(template, allSymbologies) => {
		if (template && template.symbologies){
			return _.filter(allSymbologies, (symbology) => {
				return _.find(template.symbologies, (key) => {
					return key === symbology.key;
				});
			});
		} else {
			return [];
		}
	}
);

export default {
	getTemplates: getTemplates,

	getSymbologiesForTemplate: getSymbologiesForTemplate
};