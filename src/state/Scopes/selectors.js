import {createSelector} from 'reselect';
import _ from 'lodash';
import Select from '../Select';

const getActiveScopeKey = state => state.scopes.activeScopeKey;
const getScopes = state => state.scopes.data;

const getActiveScopeData = createSelector(
	[getScopes, getActiveScopeKey],
	(scopes, activeKey) => {
		return _.find(scopes, function(scope){
			return scope.key === activeKey;
		});
	}
);

const getActiveScopeConfiguration = createSelector(
	[getActiveScopeData],
	(data) => {
		return data && data.configuration ? data.configuration : null;
	}
);

const getPucsSourceVectorLayerTemplate = createSelector(
	[getActiveScopeConfiguration],
	(conf) => {
		return conf && conf.pucsLandUseScenarios && conf.pucsLandUseScenarios.templates && conf.pucsLandUseScenarios.templates.sourceVector ? conf.pucsLandUseScenarios.templates.sourceVector : null;
	}
);

const getPucsSourceVectorLandCoverClasses = createSelector(
	[getPucsSourceVectorLayerTemplate,
		(state) => Select.layerTemplates.getTemplates(state),
		(state) => Select.attributeSets.getAttributeSets(state),
		(state) => Select.attributes.getAttributes(state)],
	(templateKey, templates, attributeSets, attributes) => {
		let template = _.find(templates, (tmplt) => {
			return tmplt.key === templateKey;
		});
		if (template && template.attributeSets && template.attributeSets.length){
			let attributeSet = _.find(attributeSets, (as) => {
				return as.key === template.attributeSets[0];
			});
			if (attributeSet){
				let attribute = _.find(attributes, (attr) => {
					return attr.key === attributeSet.attributes[0];
				});
				if (attribute && attribute.enumerationValues){
					return attribute.enumerationValues;
				} else {
					console.warn('Scope selectors#getPucsSourceVectorLandCoverClasses: Attibute set ' + attributeSet.key + ' does not contain attributes or first attribute does not have enumeration values parameter!');
					return [];
				}
			} else {
				console.warn('Scope selectors#getPucsSourceVectorLandCoverClasses: Layer template ' + templateKey + ' does not contain attribute sets!');
				return [];
			}
		} else {
			return [];
		}
	}
);

export default {
	getActiveScopeConfiguration: getActiveScopeConfiguration,
	getActiveScopeData: getActiveScopeData,
	getActiveScopeKey: getActiveScopeKey,
	getScopes: getScopes,

	getPucsSourceVectorLandCoverClasses: getPucsSourceVectorLandCoverClasses,
	getPucsSourceVectorLayerTemplate: getPucsSourceVectorLayerTemplate
};