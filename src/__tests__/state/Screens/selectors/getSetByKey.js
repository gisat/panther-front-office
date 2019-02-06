import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {BASIC_STATE, INITIAL_STATE} from "../../../../__testUtils/sampleStates/screens";

describe('#getSetByKey', () => {
	it('should select set by given key', () => {
		const setKey = 'set2';
		const expectedOutput = {
			orderByHistory: ['sceen11'],
			orderBySpace: ['screen11'],
		};
		Selector(Select.screens.getSetByKey).expect(BASIC_STATE, setKey).toReturn(expectedOutput);
	});

	it('should select null if no set key was passed', () => {
		expect(Selector(Select.screens.getSetByKey).execute(BASIC_STATE)).toBeNull();
	});

	it('should select null if no set was found for given set key', () => {
		const setKey = 'set99';
		expect(Selector(Select.screens.getSetByKey).execute(BASIC_STATE, setKey)).toBeNull();
	});

	it('should select null there are no sets present', () => {
		const setKey = 'set2';
		expect(Selector(Select.screens.getSetByKey).execute(INITIAL_STATE, setKey)).toBeNull();
	});
});