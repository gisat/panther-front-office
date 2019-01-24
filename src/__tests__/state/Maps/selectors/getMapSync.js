import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {getSubstate, BASIC_STATE, MAP_SET_WITHOUT_SYNC, MAP_SET_EMPTY_SYNC} from "../../../../__testUtils/sampleStates/maps";

describe('#getMapSync', () => {
	it('should return sync object, if the map is part of a set', () => {
		const mapKey = 'Map1';

		const expectedOutput = {
			location: true,
			roll: false,
			range: false,
			tilt: false,
			heading: false,
			elevation: false,
		};

		Selector(Select.maps.getMapSync).expect(BASIC_STATE, mapKey).toReturn(expectedOutput);
	});

	it('should return null, if map set has no sync property', () => {
		const mapKey = 'Map1';
		expect(Selector(Select.maps.getMapSync).execute(MAP_SET_WITHOUT_SYNC, mapKey)).toBeNull();
	});

	it('should return null, if map set has empty sync property', () => {
		const mapKey = 'Map1';
		expect(Selector(Select.maps.getMapSync).execute(MAP_SET_EMPTY_SYNC, mapKey)).toBeNull();
	});

	it('should return null, if map is not a part of any map set', () => {
		const mapKey = 'Map4';
		expect(Selector(Select.maps.getMapSync).execute(BASIC_STATE, mapKey)).toBeNull();
	});

	it('should return null, if map set does not exist', () => {
		const mapKey = 'Map99';
		expect(Selector(Select.maps.getMapSync).execute(BASIC_STATE, mapKey)).toBeNull();
	});

	it('should return null, if no mapKey was passed', () => {
		expect(Selector(Select.maps.getMapSync).execute(BASIC_STATE, null)).toBeNull();
	});
});