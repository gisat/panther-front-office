import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {BASIC_STATE, INITIAL_STATE} from "../../../../__testUtils/sampleStates/screens";

describe('#getScreensBySetKey', () => {
	it('should select all screens for given set key', () => {
		const setKey = 'set2';
		const expectedOutput = {
			screen11: {
				lineage: 'screen11',
				data: {
					width: null,
					minActiveWidth: null,
					desiredState: 'open'
				}
			}
		};
		Selector(Select.screens.getScreensBySetKey).expect(BASIC_STATE, setKey).toReturn(expectedOutput);
	});

	it('should select null if no set key was passed', () => {
		expect(Selector(Select.screens.getScreensBySetKey).execute(BASIC_STATE)).toBeNull();
	});

	it('should select null if no set was found for given set key', () => {
		const setKey = 'set99';
		expect(Selector(Select.screens.getScreensBySetKey).execute(BASIC_STATE, setKey)).toBeNull();
	});

	it('should select null there are no sets present', () => {
		const setKey = 'set2';
		expect(Selector(Select.screens.getScreensBySetKey).execute(INITIAL_STATE, setKey)).toBeNull();
	});
});