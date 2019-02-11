import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {getSubstate, BASIC_STATE, EMPTY_SETS_STATE} from "../../../../__testUtils/sampleStates/maps";

describe('#getMapSets', () => {
	it('should select all sets as array', () => {
		const expectedOutput = [
			{
				key: 'MapSet1',
				maps: ['Map1', 'Map2', 'Map3'],
				data: {
					metadataModifiers: {
						period: 'period1'
					},
					backgroundLayer: 'background2',
					layers: [{
						layerTemplate: 'layerFromSet1'
					}],
					worldWindNavigator: {
						lookAtLocation: {
							longitude: 10,
							latitude: 60
						},
						range: 10000,
						tilt: 0,
						heading: 10,
						roll: 0
					}
				},
				sync: {
					location: true,
					roll: false,
					range: false,
					tilt: false,
					heading: false,
					elevation: false,
				}
			}
		];
		Selector(Select.maps.getMapSets).expect(BASIC_STATE).toReturn(expectedOutput);
	});

	it('should select null, if sets are empty', () => {
		Selector(Select.maps.getMapSetsAsObject).expect(EMPTY_SETS_STATE).toReturn({});
	});
});