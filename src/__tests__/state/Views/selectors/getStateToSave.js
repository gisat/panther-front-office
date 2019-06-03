import Select from "../../../../state/Select";
import {getSubstate, BASIC_STATE, EMPTY_MODELS_STATE, NO_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#getStateToSave', () => {
	it('should select state to save', () => {
		let expectedOutput = {
			attributes: {
				activeKeys: ['a', 'b']
			},
			attributeSets: {
				activeKey: 'c',
			}
		};

		expect(Select.views.getStateToSave(BASIC_STATE)).toEqual(expectedOutput);
	});
});