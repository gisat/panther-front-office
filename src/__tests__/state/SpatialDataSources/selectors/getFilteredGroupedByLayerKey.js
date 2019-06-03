import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {BASIC_STATE as BASIC_STATE_DS, EMPTY_DATA_STATE as EMPTY_DATA_STATE_DS,  NULL_DATA_STATE as NULL_DATA_STATE_DS} from "../../../../__testUtils/sampleStates/spatialDataSources";
import {BASIC_STATE as BASIC_STATE_REL, EMPTY_DATA_STATE as EMPTY_DATA_STATE_REL, NULL_DATA_STATE as NULL_DATA_STATE_REL} from "../../../../__testUtils/sampleStates/spatialRelations";

const BASIC_STATE = {...BASIC_STATE_DS, ...BASIC_STATE_REL};
const EMPTY_RELATIONS = {...BASIC_STATE_DS, ...EMPTY_DATA_STATE_REL};
const NULL_RELATIONS = {...BASIC_STATE_DS, ...NULL_DATA_STATE_REL};
const EMPTY_SOURCES = {...BASIC_STATE_REL, ...EMPTY_DATA_STATE_DS};
const NULL_SOURCES = {...BASIC_STATE_REL, ...NULL_DATA_STATE_DS};

describe('#getFilteredGroupedByLayerKey', () => {
	it('should select data sources for given filters grouped by layer key', () => {
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
			layer1: [{
				key: 'ds2',
				data: {
					type: "wmts",
					urls: ["http://a.tile.stamen.com/terrain/{z}/{x}/{y}.png", "http://b.tile.stamen.com/terrain/{z}/{x}/{y}.png", "http://c.tile.stamen.com/terrain/{z}/{x}/{y}.png"]
				}
			}, null],
			layer2: [null]
		};

		Selector(Select.spatialDataSources.getFilteredGroupedByLayerKey).expect(BASIC_STATE, layers).toReturn(expectedOutput);
	});

	it('should return null if no layers were passed', () => {
		const layers = null;
		expect(Selector(Select.spatialDataSources.getFilteredGroupedByLayerKey).execute(BASIC_STATE, layers)).toBeNull();
	});

	it('should return null as an array item, if data sources are empty', () => {
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
			layer1: [null, null],
			layer2: [null]
		};

		Selector(Select.spatialDataSources.getFilteredGroupedByLayerKey).expect(EMPTY_SOURCES, layers).toReturn(expectedOutput);
	});

	it('should return null as an array item, if data sources are null', () => {
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
			layer1: [null, null],
			layer2: [null]
		};

		Selector(Select.spatialDataSources.getFilteredGroupedByLayerKey).expect(NULL_SOURCES, layers).toReturn(expectedOutput);
	});

	it('should return null as an array item, if relations for given filter are empty', () => {
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

		Selector(Select.spatialDataSources.getFilteredGroupedByLayerKey).expect(EMPTY_RELATIONS, layers).toReturn(expectedOutput);
	});

	it('should return null as an array item, if relations for given filter are null', () => {
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

		Selector(Select.spatialDataSources.getFilteredGroupedByLayerKey).expect(NULL_RELATIONS, layers).toReturn(expectedOutput);
	});
});