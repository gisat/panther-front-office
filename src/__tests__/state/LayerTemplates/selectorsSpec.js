import Select from '../../../state/Select';
import {Selector} from 'redux-testkit';

let state = {
	layerTemplates: {
		data: [{
			"name":"Urban Atlas","symbologies":[1,2],"key":3989}, {
			"name":"Symbology 2", "symbologies":[],"key":3999
		}]
	},
	symbologies: {
		data: [{
			"name":"pucs model output hwd","symbologyName":"pucs_hwd","source":"geoserver","key":1
		}]
	}
};

describe('Layer Templates Selectors', () => {
	it('should select layer templates data from state', () => {
		let expectedResult = [{
			"name":"Urban Atlas","symbologies":[1,2],"key":3989}, {
			"name":"Symbology 2", "symbologies":[],"key":3999
		}];
		Selector(Select.layerTemplates.getTemplates).expect(state).toReturn(expectedResult);
	});

	it('should select sybombologies data for given layer template', () => {
		let result = [{
			"name":"pucs model output hwd","symbologyName":"pucs_hwd","source":"geoserver","key":1
		}];
		let templateWithSymbologies = 3989;
		let templateWithoutSymbologies = 3999;

		Selector(Select.layerTemplates.getSymbologiesForTemplate).expect(state, templateWithSymbologies).toReturn(result);
		Selector(Select.layerTemplates.getSymbologiesForTemplate).expect(state, templateWithoutSymbologies).toReturn([]);
	});
});