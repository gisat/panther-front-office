import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {getSubstate, BASIC_STATE, EMPTY_MAPS_STATE, EMPTY_SET_DATA_STATE, EMPTY_SET_NAVIGATOR_STATE} from "../../../../__testUtils/sampleStates/maps";

describe('#getMapNavigator', () => {
	it('should override properties in map set navigator with map navigator properties', () => {
		const mapKey = 'Map1';
		const setKey = 'MapSet1';

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

		Selector(Select.maps.getMapNavigator).expect(BASIC_STATE, mapKey, setKey).toReturn(expectedOutput);
	});

	it('should return navigator from map set, if data for given map is empty', () => {
		const mapKey = 'Map2';
		const setKey = 'MapSet1';

		const expectedOutput = BASIC_STATE.maps.sets[setKey].data.worldWindNavigator;

		Selector(Select.maps.getMapNavigator).expect(BASIC_STATE, mapKey, setKey).toReturn(expectedOutput);
	});

	it('should return navigator from map set, if worldWindNavigor for given is empty', () => {
		const mapKey = 'Map3';
		const setKey = 'MapSet1';

		const expectedOutput = BASIC_STATE.maps.sets[setKey].data.worldWindNavigator;

		Selector(Select.maps.getMapNavigator).expect(BASIC_STATE, mapKey, setKey).toReturn(expectedOutput);
	});

	it('should return null, if map set does not contain given map', () => {
		const mapKey = 'Map4';
		const setKey = 'MapSet1';

		expect(Selector(Select.maps.getMapNavigator).execute(BASIC_STATE, mapKey, setKey)).toBeNull();
	});

	it('should return null, if map does not exist', () => {
		const mapKey = 'Map99';
		const setKey = 'MapSet1';

		expect(Selector(Select.maps.getMapNavigator).execute(BASIC_STATE, mapKey, setKey)).toBeNull();
	});

	it('should return navigator from map, if no map set key was passed', () => {
		const mapKey = 'Map1';

		const expectedOutput = BASIC_STATE.maps.maps[mapKey].data.worldWindNavigator;

		Selector(Select.maps.getMapNavigator).expect(BASIC_STATE, mapKey).toReturn(expectedOutput);
	});

	it('should return navigator from map, if map set does not exist', () => {
		const mapKey = 'Map1';
		const setKey = 'MapSet99';
		const expectedOutput = BASIC_STATE.maps.maps[mapKey].data.worldWindNavigator;

		Selector(Select.maps.getMapNavigator).expect(EMPTY_SET_DATA_STATE, mapKey, setKey).toReturn(expectedOutput);
	});

	it('should return navigator from map, if map set has empty data', () => {
		const mapKey = 'Map1';
		const setKey = 'MapSet1';
		const expectedOutput = BASIC_STATE.maps.maps[mapKey].data.worldWindNavigator;

		Selector(Select.maps.getMapNavigator).expect(EMPTY_SET_DATA_STATE, mapKey, setKey).toReturn(expectedOutput);
	});

	it('should return navigator from map, if map set has empty navigator', () => {
		const mapKey = 'Map1';
		const setKey = 'MapSet1';
		const expectedOutput = BASIC_STATE.maps.maps[mapKey].data.worldWindNavigator;

		Selector(Select.maps.getMapNavigator).expect(EMPTY_SET_NAVIGATOR_STATE, mapKey, setKey).toReturn(expectedOutput);
	});
});