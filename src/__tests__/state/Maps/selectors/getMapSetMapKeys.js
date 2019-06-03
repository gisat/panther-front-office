import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {getSubstate, BASIC_STATE, EMPTY_SETS_STATE} from "../../../../__testUtils/sampleStates/maps";

describe('#getMapSetMapKeys', () => {
	it('should select map keys for given map set', () => {
		const setKey = 'MapSet1';
		const expectedOutput = ['Map1', 'Map2', 'Map3'];
		Selector(Select.maps.getMapSetMapKeys).expect(BASIC_STATE, setKey).toReturn(expectedOutput);
	});

	it('should select null, if set for given key does not exist', () => {
		const setKey = 'aaa';
		expect(Selector(Select.maps.getMapSetMapKeys).execute(BASIC_STATE, setKey)).toBeNull();
	});

	it('should select null for empty sets', () => {
		const setKey = 'aaa';
		expect(Selector(Select.maps.getMapSetMapKeys).execute(EMPTY_SETS_STATE, setKey)).toBeNull();
	});

	it('should select null, if no key was passed', () => {
		expect(Selector(Select.maps.getMapSetMapKeys).execute(BASIC_STATE)).toBeNull();
	});
});