import Select from '../../../state/Select';
import {Selector} from 'redux-testkit';

let state = {
	scopes: {
		activeScopeKey: 3971,
		data: [{
			key: 3971,
			configuration: {"pucsLandUseScenarios":{"templates":{"sourceVector":3332,"sourceRaster":4090,"uhi":4091,"hwd":4092}}}
		}]
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
});