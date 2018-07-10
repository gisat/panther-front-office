import Select from '../../../state/Select';
import {Selector} from 'redux-testkit';

let state = {
	spatialDataSources: {
		main: {
			data: [{
				"type": "shapefile",
				"data": {
					"layer_name": "geonode:pucs_d75201d795c14210bba3e245c5cca2f0",
					"table_name": "pucs_d75201d795c14210bba3e245c5cca2f0"
				},
				"key": 288
			}]
		}
	}
};

describe('Spatial Data Sources Selectors', () => {
	it('should select data for given data source', () => {
		let expectedDataSource = {"type":"shapefile","data":{"layer_name":"geonode:pucs_d75201d795c14210bba3e245c5cca2f0","table_name":"pucs_d75201d795c14210bba3e245c5cca2f0"},"key":288};
		Selector(Select.spatialDataSources.getDataSource).expect(state, 288).toReturn(expectedDataSource);
	});
});