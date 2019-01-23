import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {getSubstate, BASIC_STATE, EMPTY_SETS_STATE} from "../../../../__testUtils/sampleStates/maps";

describe('#getMapSetsAsObject', () => {
	it('should select all sets as object', () => {
		const expectedOutput = BASIC_STATE.maps.sets;
		Selector(Select.maps.getMapSetsAsObject).expect(BASIC_STATE).toReturn(expectedOutput);
	});

	it('should select empty object, if sets are empty', () => {
		Selector(Select.maps.getMapSetsAsObject).expect(EMPTY_SETS_STATE).toReturn({});
	});
});