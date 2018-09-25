import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";
import StylesSelector from "../Symbologies/selectors";

const getSubstate = state => state.layerTemplates;

const getAll = common.getAll(getSubstate);
const getTemplate = common.getByKey(getSubstate);

const getSymbologiesForTemplate = createSelector(
	[getTemplate, StylesSelector.getSymbologies],
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
	getTemplates: getAll,
	getTemplate,
	getSymbologiesForTemplate
};