import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {BASIC_STATE, EMPTY_DATA_STATE, NULL_DATA_STATE} from "../../../../__testUtils/sampleStates/spatialRelations";

describe('#getDataSourceKeysGroupedByLayerKey', () => {
	it('should select relations grouped by layer key', () => {
		const layers = [{
			filter: {
				layerTemplateKey: "lt1",
				periodKey: 'period1'
			},
			data: {
				key: "layer1"
			}
		}, {
			filter: {
				layerTemplateKey: "lt99",
			},
			data: {
				key: "layer2"
			}
		}];

		const expectedOutput = {
			layer1: ["ds2", "ds4"],
			layer2: [null]
		};

		Selector(Select.spatialRelations.getDataSourceKeysGroupedByLayerKey).expect(BASIC_STATE, layers).toReturn(expectedOutput);
	});

	it('should select select grouped data ([null]) by layer key, even if relations data are empty', () => {
		const layers = [{
			filter: {
				layerTemplateKey: "lt1",
				periodKey: 'period1'
			},
			data: {
				key: "layer1"
			}
		}, {
			filter: {
				layerTemplateKey: "lt99",
			},
			data: {
				key: "layer2"
			}
		}];

		const expectedOutput = {
			layer1: [null],
			layer2: [null]
		};

		Selector(Select.spatialRelations.getDataSourceKeysGroupedByLayerKey).expect(EMPTY_DATA_STATE, layers).toReturn(expectedOutput);
	});

	it('should select grouped data ([null]) by layer key, even if relations there are no relations', () => {
		const layers = [{
			filter: {
				layerTemplateKey: "lt1",
				periodKey: 'period1'
			},
			data: {
				key: "layer1"
			}
		}, {
			filter: {
				layerTemplateKey: "lt99",
			},
			data: {
				key: "layer2"
			}
		}];

		const expectedOutput = {
			layer1: [null],
			layer2: [null]
		};

		Selector(Select.spatialRelations.getDataSourceKeysGroupedByLayerKey).expect(NULL_DATA_STATE, layers).toReturn(expectedOutput);
	});

	it('should return null if no layers were passed', () => {
		const layers = null;
		expect(Selector(Select.spatialRelations.getDataSourceKeysGroupedByLayerKey).execute(BASIC_STATE, layers)).toBeNull();
	});

	it('should return null if empty layers were passed', () => {
		const layers = [];
		expect(Selector(Select.spatialRelations.getDataSourceKeysGroupedByLayerKey).execute(BASIC_STATE, layers)).toBeNull();
	});

	it('should return null if any layer has no data, data are empty, or data does not contain key', () => {
		const layers = [{
			filter: {
				layerTemplateKey: "lt2",
			},
			data: null
		}, {
			filter: {
				layerTemplateKey: "lt2",
			},
			data: {}
		}, {
			filter: {
				layerTemplateKey: "lt2",
			},
			data: {
				sth: 'xxx'
			}
		}];
		expect(Selector(Select.spatialRelations.getDataSourceKeysGroupedByLayerKey).execute(BASIC_STATE, layers)).toBeNull();
	});
});