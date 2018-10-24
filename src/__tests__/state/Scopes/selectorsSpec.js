import Select from '../../../state/Select';
import {Selector} from 'redux-testkit';
import _ from 'lodash';

let state = {
	scopes: {
		activeKey: 3971,
		byKey: {
			3971: {
				key: 3971,
				data: {
					configuration: {
						"pucsLandUseScenarios": {
							"templates": {
								"sourceVector": 3332,
								"sourceRaster": 4090,
								"uhi": 4091,
								"hwd": 4092
							}
						}
					}
				},
				permissions: {
					group: [{permission: "GET", id: 2}],
					user: [{permission: "GET", id: 3}, {permission: "GET", id: 4}]
				}
			},
			3972: {
				key: 3972,
				permissions: {
					group: [{permission: "GET", id: 4}],
				}
			},
			3973: {
				key: 3973,
				permissions: {
					group: [],
					user: [{permission: "GET", id: 2}, {permission: "POST", id: 4}]
				}
			}}
	},
	layerTemplates: {
		byKey: {
			3332: {"layerType":"vector","name":"PUCS Urban Atlas","attributeSets":[4497],"symbologies":[4325],"key":3332}
		}
	},
	attributes: {
		byKey: {4496: {enumerationValues: "A", key: 4496}}
	},
	attributeSets: {
		byKey: {4497: {"active":false,"name":"Land Use Classes","attributes":[4496],"topic":737,"featureLayers":[3332],"key":4497}}
	},
	styles: {
		byKey: {4325: {key: 4325, symbologyName: "urbanAtlas"}}
	}
};

describe('Scope basic Selectors', () => {
	it('should select active scope configuration', () => {
		let expectedConfiguration = {"pucsLandUseScenarios":{"templates":{"sourceVector":3332,"sourceRaster":4090,"uhi":4091,"hwd":4092}}};
		Selector(Select.scopes.getActiveScopeConfiguration).expect(state).toReturn(expectedConfiguration);
	});

	it('should select sourceVector layerTemplate key', () => {
		Selector(Select.scopes.getPucsSourceVectorLayerTemplate).expect(state).toReturn(3332);
	});
	it('should select enumeration values of first attribute from attribute set attached to pucs source vector layer template', () => {
		let enumerationValues = "A";
		Selector(Select.scopes.getPucsSourceVectorLandCoverClasses).expect(state).toReturn(enumerationValues);
	});
	it ('should select symbology name of pucs source data layer first symbology', () => {
		let expectedSymbologyName = "urbanAtlas";
		Selector(Select.scopes.getSymbologyForPucsSourceVectorLayerTemplate).expect(state).toReturn(expectedSymbologyName);
	});
	it ('should select data for given scope', () => {
		let expectedScopeData = {
			key: 3971,
			data: {
				configuration: {
					"pucsLandUseScenarios": {
						"templates": {
							"sourceVector": 3332,
							"sourceRaster": 4090,
							"uhi": 4091,
							"hwd": 4092
						}
					}
				}
			},
			permissions: {
				group: [{permission: "GET", id: 2}],
				user: [{permission: "GET", id: 3}, {permission: "GET", id: 4}]
			},
		};
		Selector(Select.scopes.getScopeData).expect(state, 3971).toReturn(expectedScopeData);
	});
});