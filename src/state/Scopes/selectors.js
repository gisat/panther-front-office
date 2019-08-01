import {createSelector} from 'reselect';
import _ from 'lodash';
import Select from '../Select';

import common from "../_common/selectors";

const getSubstate = state => state.scopes;

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);
const getAllForDataview = common.getAllForDataview(getSubstate);
const getAllForDataviewAsObject = common.getAllForDataviewAsObject(getSubstate);
const getActiveKey = common.getActiveKey(getSubstate);

const getActive = common.getActive(getSubstate);
const getByKey = common.getByKey(getSubstate);


const getActiveScopeConfiguration = createSelector(
	[getActive],
	(scope) => {
		return scope && scope.data && scope.data.configuration ? scope.data.configuration : null;
	}
);

const getScopesForActiveUser = createSelector([
	getAll,
	],(scopes) => {
		return scopes;
	}
);

const getPucsSourceVectorLayerTemplate = createSelector(
	[getActiveScopeConfiguration],
	(conf) => {
		return conf && conf.pucsLandUseScenarios && conf.pucsLandUseScenarios.templates && conf.pucsLandUseScenarios.templates.sourceVector ? conf.pucsLandUseScenarios.templates.sourceVector : null;
	}
);

const getSymbologyForPucsSourceVectorLayerTemplate = createSelector(
	[getPucsSourceVectorLayerTemplate,
	(state) => Select.layerTemplates.getTemplates(state),
	(state) => Select.styles.getAll(state)],
	(templateKey, templates, symbologies) => {
		if (templateKey){
			let templateData = _.find(templates, (tmplt) => {
				return tmplt.key === templateKey;
			});
			if (templateData && templateData.symbologies && templateData.symbologies.length){
				let symbologyKey = templateData.symbologies[0];
				let symbologyData = _.find(symbologies, (smblg) => {
					return smblg.key === symbologyKey;
				});
				if (symbologyData){
					return symbologyData.symbologyName;
				} else {
					return null;
				}
			} else {
				return null;
			}
		} else {
			console.warn('Scope selectors#getSymbologiesForPucsSourceVectorLayerTemplate: Scope does not have specified the source vector layer template');
			return null;
		}
	}
);

const getPucsSourceVectorLandCoverClasses = createSelector(
	[getPucsSourceVectorLayerTemplate,
		(state) => Select.layerTemplates.getTemplates(state),
		(state) => Select.attributeSets.getAttributeSets(state),
		(state) => Select.attributes.getAttributes(state),
		(state) => Select.scopes.getActive(state),
		(state) => Select.places.getActiveKey(state),
	],
	(templateKey, templates, attributeSets, attributes, scope, activePlaceKey) => {
		let template = _.find(templates, (tmplt) => {
			return tmplt.key === templateKey;
		});
		if (template && template.data && template.data.attributeSets && template.data.attributeSets.length && attributes && attributeSets){
			let attributeSet = _.find(attributeSets, (as) => {
				return as.key === template.data.attributeSets[0];
			});
			if (attributeSet){
				let attribute = _.find(attributes, (attr) => {
					return attr.key === attributeSet.data.attributes[0];
				});
				if (attribute && attribute.data && attribute.data.enumerationValues){
					let landCoverConfig = scope && scope.data && scope.data.configuration && scope.data.configuration.pucsLandUseScenarios && scope.data.configuration.pucsLandUseScenarios.landCoverClasses;
					if (activePlaceKey && landCoverConfig) {
						let city = _.find(landCoverConfig, {'placeKey': activePlaceKey});
						if (city && city.classes) {
							return JSON.stringify(city.classes);
						}
					}
					return attribute.data.enumerationValues;
				} else {
					console.warn('Scope selectors#getPucsSourceVectorLandCoverClasses: Attibute set ' + attributeSet.key + ' does not contain attributes or first attribute does not have enumeration values parameter!');
					return null;
				}
			} else {
				console.warn('Scope selectors#getPucsSourceVectorLandCoverClasses: Layer template ' + templateKey + ' does not contain attribute sets!');
				return null;
			}
		} else {
			return null;
		}
	}
);

export default {
	getActiveScopeConfiguration,
	getActiveScopeData: getActive,
	getActiveScopeKey: getActiveKey,
	getScopes: getAll,
	getScopesForActiveUser,
	getScopeData: getByKey,

	getActiveKey,
	getAll,
	getAllAsObject,
	getAllForDataview,
	getAllForDataviewAsObject,
	getActive,
	getSubstate,

	getPucsSourceVectorLandCoverClasses,
	getPucsSourceVectorLayerTemplate,
	getSymbologyForPucsSourceVectorLayerTemplate
};