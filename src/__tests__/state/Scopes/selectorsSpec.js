import Select from '../../../state/Select';
import {Selector} from 'redux-testkit';
import _ from 'lodash';

let state = {
	scopes: {
		activeKey: 3971,
		byKey: {
			3971: {
				key: 3971,
				permissions: {
					group: [{permission: "GET", id: 2}],
					user: [{permission: "GET", id: 3}, {permission: "GET", id: 4}]
				},
				configuration: {"pucsLandUseScenarios":{"templates":{"sourceVector":3332,"sourceRaster":4090,"uhi":4091,"hwd":4092}}}
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
	symbologies: {
		data: [{key: 4325, symbologyName: "urbanAtlas"}]
	},
	users: {
		data: [{key: 2}, {key: 3}, {key: 4}, {key: 5}]
	},
	userGroups: {
		data: [{key: 4, users: [2, 3]}, {key: 5, users: [2, 4]}]
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
			permissions: {
				group: [{permission: "GET", id: 2}],
				user: [{permission: "GET", id: 3}, {permission: "GET", id: 4}]
			},
			configuration: {"pucsLandUseScenarios":{"templates":{"sourceVector":3332,"sourceRaster":4090,"uhi":4091,"hwd":4092}}}
		};
		Selector(Select.scopes.getScopeData).expect(state, 3971).toReturn(expectedScopeData);
	});
});

// describe('Scope selectors with permissions', () => {
// 	it ('should select 3 scopes for admin', () => {
// 		let stateWithAdmin = _.cloneDeep(state);
// 		stateWithAdmin.users.isAdmin = true;
// 		let result = Selector(Select.scopes.getScopesForActiveUser).execute(stateWithAdmin);
// 		expect(result).toHaveLength(3);
// 	});
// 	it ('should select scope 3971 for user without permission', () => {
// 		let stateWithUser5 = _.cloneDeep(state);
// 		stateWithUser5.users.activeKey = 5;
// 		let result = Selector(Select.scopes.getScopesForActiveUser).execute(stateWithUser5);
// 		expect(result).toHaveLength(1);
// 		expect(result[0].key).toEqual(3971);
// 	});
// 	it ('should select scope 3971 if there is no logged in user', () => {
// 		let result = Selector(Select.scopes.getScopesForActiveUser).execute(state);
// 		expect(result).toHaveLength(1);
// 		expect(result[0].key).toEqual(3971);
// 	});
// 	it ('should select scope 3971 and 3972 for user 3', () => {
// 		let stateWithUser2 = _.cloneDeep(state);
// 		stateWithUser2.users.activeKey = 3;
// 		let result = Selector(Select.scopes.getScopesForActiveUser).execute(stateWithUser2);
// 		let keys = result.map(scope => scope.key);
// 		expect(result).toHaveLength(2);
// 		expect(keys).toContain(3971);
// 		expect(keys).toContain(3972);
// 	});
// });