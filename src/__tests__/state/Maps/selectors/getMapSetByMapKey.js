import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {getSubstate, BASIC_STATE, EMPTY_SETS_STATE} from "../../../../__testUtils/sampleStates/maps";

describe('#getMapSetByMapKey', () => {
	it('should return map set, if the map is a part of it', () => {
		const mapKey = 'Map1';
		const setKey = 'MapSet1';

		const expectedOutput = {
			key: 'MapSet1',
			maps: ['Map1', 'Map2', 'Map3'],
			data: {
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

		Selector(Select.maps.getMapSetByMapKey).expect(BASIC_STATE, mapKey).toReturn(expectedOutput);
	});

	it('should return null, if map is not part of any set', () => {
		const mapKey = 'Map4';
		expect(Selector(Select.maps.getMapSetByMapKey).execute(BASIC_STATE, mapKey)).toBeNull();
	});

	it('should return null, if map sets is empty', () => {
		const mapKey = 'Map1';
		expect(Selector(Select.maps.getMapSetByMapKey).execute(EMPTY_SETS_STATE, mapKey)).toBeNull();
	});

	it('should return null, if no map key was passed', () => {
		expect(Selector(Select.maps.getMapSetByMapKey).execute(BASIC_STATE, null)).toBeNull();
	});
});