import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {getSubstate, BASIC_STATE, EMPTY_MAPS_STATE, EMPTY_SETS_STATE} from "../../../../__testUtils/sampleStates/maps";

describe('#getBackgroundLayerStateByMapKey', () => {
	it('should select background layer state from map', () => {
		const mapKey = 'Map1';
		let expectedOutput = {
			filter: {
				layerTemplateKey: 'background1',
				caseKey: null,
				periodKey: null,
				placeKey: null,
				scenarioKey: null
			},
			filterByActive: {
				scope: true
			},
			mergedFilter: {
				caseKey: null,
				layerTemplateKey: 'background1',
				periodKey: null,
				placeKey: null,
				scenarioKey: null,
				scopeKey: 'scope1'
			},
			layer: {
				case: null,
				period: null,
				place: null,
				scenario: null,
				layerTemplate: 'background1',
				key: 'background1'
			}
		};
		Selector(Select.maps.getBackgroundLayerStateByMapKey_deprecated).expect(BASIC_STATE, mapKey).toReturn(expectedOutput);
	});

	it('should select layer template from set', () => {
		const mapKey = 'Map3';
		let expectedOutput = {
			filter: {
				layerTemplateKey: 'background2',
				caseKey: null,
				periodKey: null,
				placeKey: null,
				scenarioKey: null
			},
			filterByActive: {
				scope: true
			},
			mergedFilter: {
				caseKey: null,
				layerTemplateKey: 'background2',
				periodKey: null,
				placeKey: null,
				scenarioKey: null,
				scopeKey: 'scope1'
			},
			layer: {
				case: null,
				period: null,
				place: null,
				scenario: null,
				layerTemplate: 'background2',
				key: 'background2'
			}
		};
		Selector(Select.maps.getBackgroundLayerStateByMapKey_deprecated).expect(BASIC_STATE, mapKey).toReturn(expectedOutput);
	});

	it('should select null, if no map key was passed', () => {
		expect(Selector(Select.maps.getBackgroundLayerStateByMapKey_deprecated).execute(BASIC_STATE)).toBeNull();
	});
});