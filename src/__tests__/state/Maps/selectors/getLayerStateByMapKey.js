import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {getSubstate, BASIC_STATE, EMPTY_MAPS_STATE, EMPTY_SETS_STATE} from "../../../../__testUtils/sampleStates/maps";

describe('#getLayersStateByMapKey', () => {
	it('should select layers state from map', () => {
		const mapKey = 'Map1';
		let expectedOutput = [{
			filter: {
				layerTemplateKey: 'layerFromSet1',
				placeKey: 'place1',
				periodKey: 'period1'
			},
			filterByActive: {
				scope: true,
				case: true,
				scenario: true
			},
			mergedFilter: {
				layerTemplateKey: 'layerFromSet1',
				placeKey: 'place1',
				scopeKey: 'scope1',
				periodKey: 'period1'
			},
			layer: {
				place: 'place1',
				period: 'period1',
				layerTemplate: 'layerFromSet1'
			}
		}, {
			filter: {
				layerTemplateKey: 'template1',
				placeKey: 'place1',
				periodKey: 'period1'
			},
			filterByActive: {
				scope: true,
				case: true,
				scenario: true
			},
			mergedFilter: {
				layerTemplateKey: 'template1',
				placeKey: 'place1',
				scopeKey: 'scope1',
				periodKey: 'period1'
			},
			layer: {
				style: 'style1',
				place: 'place1',
				period: 'period1',
				layerTemplate: 'template1'
			}
		},{
			filter: {
				layerTemplateKey: 'template2',
				placeKey: 'place1',
				periodKey: 'period1'
			},
			filterByActive: {
				scope: true,
				case: true,
				scenario: true
			},
			mergedFilter: {
				layerTemplateKey: 'template2',
				placeKey: 'place1',
				scopeKey: 'scope1',
				periodKey: 'period1'
			},
			layer: {
				style: 'style2',
				place: 'place1',
				period: 'period1',
				layerTemplate: 'template2'
			}
		}];
		Selector(Select.maps.getLayersStateByMapKey_deprecated).expect(BASIC_STATE, mapKey).toReturn(expectedOutput);
	});

	it('should select layers state both from set and map', () => {
		const mapKey = 'Map2';
		let expectedOutput = [{
			filter: {
				layerTemplateKey: 'layerFromSet1',
				placeKey: 'place12',
				periodKey: 'period1'
			},
			filterByActive: {
				scope: true,
				case: true,
				scenario: true
			},
			mergedFilter: {
				layerTemplateKey: 'layerFromSet1',
				placeKey: 'place12',
				scopeKey: 'scope1',
				periodKey: 'period1'
			},
			layer: {
				place: 'place12',
				period: 'period1',
				layerTemplate: 'layerFromSet1'
			}
		},{
			filter: {
				layerTemplateKey: 'template4',
				placeKey: 'place12',
				periodKey: 'period1'
			},
			filterByActive: {
				scope: true,
				case: true,
				scenario: true
			},
			mergedFilter: {
				layerTemplateKey: 'template4',
				placeKey: 'place12',
				periodKey: 'period1',
				scopeKey: 'scope1',
			},
			layer: {
				place: 'place12',
				period: 'period1',
				layerTemplate: 'template4'
			}
		}];
		Selector(Select.maps.getLayersStateByMapKey_deprecated).expect(BASIC_STATE, mapKey).toReturn(expectedOutput);
	});

	it('should select null, if no map key was passed', () => {
		expect(Selector(Select.maps.getLayersStateByMapKey_deprecated).execute(BASIC_STATE)).toBeNull();
	});
});