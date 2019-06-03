import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {getSubstate, BASIC_STATE, EMPTY_MAPS_STATE, EMPTY_SET_DATA_STATE, EMPTY_SET_NAVIGATOR_STATE} from "../../../../__testUtils/sampleStates/maps";

describe('#getNavigator', () => {
	it('should override properties in map set navigator with map navigator properties', () => {
		const mapKey = 'Map1';

		const expectedOutput = {
			lookAtLocation: {
				longitude: 15,
				latitude: 50
			},
			range: 10000,
			tilt: 0,
			heading: 10,
			roll: 0
		};

		Selector(Select.maps.getNavigator).expect(BASIC_STATE, mapKey).toReturn(expectedOutput);
	});

	it('should return navigator from map set, if data for given map is empty', () => {
		const mapKey = 'Map2';

		const expectedOutput = {
			lookAtLocation: {
				longitude: 10,
				latitude: 60
			},
			range: 10000,
			tilt: 0,
			heading: 10,
			roll: 0
		};

		Selector(Select.maps.getNavigator).expect(BASIC_STATE, mapKey).toReturn(expectedOutput);
	});

	it('should return navigator from map set, if worldWindNavigor for given map is empty', () => {
		const mapKey = 'Map3';

		const expectedOutput = {
			lookAtLocation: {
				longitude: 10,
				latitude: 60
			},
			range: 10000,
			tilt: 0,
			heading: 10,
			roll: 0
		};

		Selector(Select.maps.getNavigator).expect(BASIC_STATE, mapKey).toReturn(expectedOutput);
	});

	it('should return navigator from map, if map is not a part of any set', () => {
		const mapKey = 'Map4';

		const expectedOutput = {
			lookAtLocation: {
				longitude: 15,
					latitude: 50
			},
			range: 10000
		};

		Selector(Select.maps.getNavigator).expect(BASIC_STATE, mapKey).toReturn(expectedOutput);
	});

	it('should return null, if map does not exist', () => {
		const mapKey = 'Map99';

		expect(Selector(Select.maps.getNavigator).execute(BASIC_STATE, mapKey)).toBeNull();
	});

	it('should return navigator from map, if map set has empty data', () => {
		const mapKey = 'Map1';
		const expectedOutput = BASIC_STATE.maps.maps[mapKey].data.worldWindNavigator;

		Selector(Select.maps.getNavigator).expect(EMPTY_SET_DATA_STATE, mapKey).toReturn(expectedOutput);
	});

	it('should return navigator from map, if map set has empty navigator', () => {
		const mapKey = 'Map1';
		const expectedOutput = BASIC_STATE.maps.maps[mapKey].data.worldWindNavigator;

		Selector(Select.maps.getNavigator).expect(EMPTY_SET_NAVIGATOR_STATE, mapKey).toReturn(expectedOutput);
	});
});