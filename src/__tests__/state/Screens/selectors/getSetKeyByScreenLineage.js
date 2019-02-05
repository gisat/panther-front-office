import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {BASIC_STATE, INITIAL_STATE} from "../../../../__testUtils/sampleStates/screens";

describe('#getSetKeyByScreenLineage', () => {
	it('should select set key by given lineage', () => {
		const screenLineage = 'screen4';
		const expectedOutput = 'set1';
		Selector(Select.screens.getSetKeyByScreenLineage).expect(BASIC_STATE, screenLineage).toReturn(expectedOutput);
	});

	it('should select set null if no lineage was passed', () => {
		expect(Selector(Select.screens.getSetKeyByScreenLineage).execute(BASIC_STATE)).toBeNull();
	});

	it('should select set null if no set was found for given lineage', () => {
		const screenLineage = 'screen999';
		expect(Selector(Select.screens.getSetKeyByScreenLineage).execute(BASIC_STATE, screenLineage)).toBeNull();
	});

	it('should select set null for initial state', () => {
		const screenLineage = 'screen1';
		expect(Selector(Select.screens.getSetKeyByScreenLineage).execute(INITIAL_STATE, screenLineage)).toBeNull();
	});
});