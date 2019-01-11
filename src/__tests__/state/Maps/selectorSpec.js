import Select from '../../../state/Select';
import {Selector} from 'redux-testkit';

let state = {
	maps: {
		defaults: {
			navigator: {
				lookAtLocation: {
					longitude: 150,
					latitude: 30
				},
				range: 3333
			}
		}
	},
	scopes: {
		activeKey: 3971,
		byKey: {
			3971: {
				key: 3971,
				data: {
					configuration: {"pucsLandUseScenarios":{"templates":{"sourceVector":3332,"sourceRaster":4090,"uhi":4091,"hwd":4092}}}
				}
			}
		}
	},
	spatialDataSources: {
		main: {data: [{"key":214, "type":"shapefile", data: {"layer_name":"geonode:pucs_514f7a7552564ceebd269a8d334f1324","table_name":"pucs_514f7a7552564ceebd269a8d334f1324"}},
				{"key": 215, "type":"shapefile", data: {"layer_name":"geonode:pucs_514f7a7552564ceebd269a8d334f1324","table_name":"pucs_514f7a7552564ceebd269a8d334f1324"}}]}
	},
	spatialRelations: {
		data: [{"key":127, data: {"scope_id":null,"period_id":null,"place_id":3975,"data_source_id":214,"layer_template_id":3332,"scenario_id":null}}]
	},
	places: {
		activeKey: 3975
	}
};

let defaultsNullState = {
	maps: {
		defaults: null
	}
};

describe('Maps Selectors', () => {
	it('should select navigator data from map defaults', () => {
		let expectedResult = {
			lookAtLocation: {
				longitude: 150,
				latitude: 30
			},
			range: 3333
		};
		Selector(Select.maps.getNavigator).expect(state).toReturn(expectedResult);
	});

	it('should return null when map defaults has not been initialized yet', () => {
		Selector(Select.maps.getNavigator).expect(defaultsNullState).toReturn(null);
	});

	it('should select vector data sources for given template', () => {
		let layerTemplate = 3332;
		let dataForVectorLayer = [{
			dataSource: "geonode:pucs_514f7a7552564ceebd269a8d334f1324",
			scenarioKey: null,
			relationKey: 127,
			dataSourceKey: 214
		}];
		Selector(Select.maps.getVectorLayersForTemplate).expect(state, layerTemplate).toReturn(dataForVectorLayer);
	});

	it('should select vector data sources for vectour source layer template from scope configuration', () => {
		let dataForVectorLayer = [{
			dataSource: "geonode:pucs_514f7a7552564ceebd269a8d334f1324",
			scenarioKey: null,
			relationKey: 127,
			dataSourceKey: 214
		}];
		Selector(Select.maps.getVectorLayersForPuscVectorSourceTemplate).expect(state).toReturn(dataForVectorLayer);
	});
});