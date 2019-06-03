import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {BASIC_STATE, INITIAL_STATE} from "../../../../__testUtils/sampleStates/screens";

describe('#getScreenByLineage', () => {
	it('should select set key by given lineage', () => {
		const screenLineage = 'screen4';
		const expectedOutput = {
			lineage: 'screen4',
			data: {
				width: null,
				minActiveWidth: null,
				desiredState: 'open',
			}
		};
		Selector(Select.screens.getScreenByLineage).expect(BASIC_STATE, screenLineage).toReturn(expectedOutput);
	});

	it('should select set null if no lineage was passed', () => {
		expect(Selector(Select.screens.getScreenByLineage).execute(BASIC_STATE)).toBeNull();
	});

	it('should select set null if no screen found for given lineage', () => {
		const screenLineage = 'screen999';
		expect(Selector(Select.screens.getScreenByLineage).execute(BASIC_STATE, screenLineage)).toBeNull();
	});

	it('should select set null for initial state', () => {
		const screenLineage = 'screen1';
		expect(Selector(Select.screens.getScreenByLineage).execute(INITIAL_STATE, screenLineage)).toBeNull();
	});
});