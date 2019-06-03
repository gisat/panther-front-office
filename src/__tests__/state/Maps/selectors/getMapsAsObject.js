import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {getSubstate, BASIC_STATE, EMPTY_MAPS_STATE} from "../../../../__testUtils/sampleStates/maps";

describe('#getMapsAsObject', () => {
	it('should select all maps as object', () => {
		const expectedOutput = BASIC_STATE.maps.maps;
		Selector(Select.maps.getMapsAsObject).expect(BASIC_STATE).toReturn(expectedOutput);
	});

	it('should select empty object, if sets are empty', () => {
		Selector(Select.maps.getMapsAsObject).expect(EMPTY_MAPS_STATE).toReturn({});
	});
});