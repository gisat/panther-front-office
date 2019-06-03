import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {getSubstate, BASIC_STATE, EMPTY_SETS_STATE} from "../../../../__testUtils/sampleStates/maps";

describe('#getMapSetByKey', () => {
	it('should select map set for given key, if exists in sets', () => {
		const setKey = 'MapSet1';
		const expectedOutput = {
			key: 'MapSet1',
			maps: ['Map1', 'Map2','Map3'],
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
		};
		Selector(Select.maps.getMapSetByKey).expect(BASIC_STATE, setKey).toReturn(expectedOutput);
	});

	it('should select null, if set for given key does not exist', () => {
		const setKey = 'aaa';
		expect(Selector(Select.maps.getMapSetByKey).execute(BASIC_STATE, setKey)).toBeNull();
	});

	it('should select null for empty sets', () => {
		const setKey = 'aaa';
		expect(Selector(Select.maps.getMapSetByKey).execute(EMPTY_SETS_STATE, setKey)).toBeNull();
	});

	it('should select null, if no key was passed', () => {
		expect(Selector(Select.maps.getMapSetByKey).execute(BASIC_STATE)).toBeNull();
	});
});