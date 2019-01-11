import Select from '../../../state/Select';
import {Selector} from 'redux-testkit';

let state = {
	layerTemplates: {
		byKey: {
			3989: {
				"name": "Urban Atlas", "symbologies": [1, 2], "key": 3989
			},
			3999: {
				"name": "Symbology 2", "symbologies": [], "key": 3999
			}
		}
	},
	styles: {
		byKey: {
			1: {
				"name": "pucs model output hwd", "symbologyName": "pucs_hwd", "source": "geoserver", "key": 1
			}
		}
	}
};

describe('Layer Templates Selectors', () => {
	let nonExistingTemplate = 9999;
	let templateWithSymbologies = 3989;
	let templateWithoutSymbologies = 3999;

	it('should select layer templates data from state', () => {
		let expectedResult = [{
			"name":"Urban Atlas","symbologies":[1,2],"key":3989}, {
			"name":"Symbology 2", "symbologies":[],"key":3999
		}];
		Selector(Select.layerTemplates.getTemplates).expect(state).toReturn(expectedResult);
	});

	it('should select data for given template', () => {
		let expectedTemplate = {"name":"Urban Atlas","symbologies":[1,2],"key":3989};

		Selector(Select.layerTemplates.getTemplate).expect(state, null).toReturn(null);
		Selector(Select.layerTemplates.getTemplate).expect(state, templateWithSymbologies).toReturn(expectedTemplate);

		let nonExisting = Selector(Select.layerTemplates.getTemplate).execute(state, nonExistingTemplate);
		expect(nonExisting).toBeNull();
	});

	it('should select sybombologies data for given layer template', () => {
		let expectedSymbology  = [{
			"name":"pucs model output hwd","symbologyName":"pucs_hwd","source":"geoserver","key":1
		}];

		Selector(Select.layerTemplates.getSymbologiesForTemplate).expect(state, templateWithSymbologies).toReturn(expectedSymbology);
		Selector(Select.layerTemplates.getSymbologiesForTemplate).expect(state, templateWithoutSymbologies).toReturn([]);
		Selector(Select.layerTemplates.getSymbologiesForTemplate).expect(state, nonExistingTemplate).toReturn([]);
	});
});