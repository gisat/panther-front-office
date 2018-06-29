import Select from '../../../state/Select';
import {Selector} from 'redux-testkit';

let state = {
	scopes: {
		activeScopeKey: 3971,
		data: [{
			key: 3971,
			configuration: {"pucsLandUseScenarios":{"templates":{"sourceVector":3332,"sourceRaster":4090,"uhi":4091,"hwd":4092}}}
		}]
	},
	layerTemplates: {
		data: [{"layerType":"vector","name":"PUCS Urban Atlas","attributeSets":[4497],"symbologies":[4325],"key":3332}]
	},
	attributes: {
		data: [{enumerationValues: "A", key: 4496}]
	},
	attributeSets: {
		data: [{"active":false,"name":"Land Use Classes","attributes":[4496],"topic":737,"featureLayers":[3332],"key":4497}]
	},
	symbologies: {
		data: [{key: 4325, symbologyName: "urbanAtlas"}]
	}
};

describe('Scope Selectors', () => {
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
});