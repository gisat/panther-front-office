import commonReducers from "../../../../state/_common/reducers";
import {BASIC_STATE, NO_EDITED_MODELS_STATE, EMPTY_EDITED_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#removeEdited', () => {
	it('should remove edited models', () => {
		const action = {
			keys: [4, 'nejake-nahodne-uuid']
		};
		const expectedState = {
			...BASIC_STATE.sample,
			editedByKey: {
				1: {
					key: 1,
					data: {
						name: "Svět",
						description: "..."
					}
				},
			}
		};
		expect(commonReducers.removeEdited(BASIC_STATE.sample, action)).toEqual(expectedState);
	});

	it('should not remove any data from edited', () => {
		const action = {
			keys: null
		};
		const expectedState = {...BASIC_STATE.sample};
		expect(commonReducers.removeEdited(BASIC_STATE.sample, action)).toEqual(expectedState);
	});

	it('should not modify editedByKey, if it is null', () => {
		const action = {
			keys: [1, 2]
		};
		expect(commonReducers.removeEdited(NO_EDITED_MODELS_STATE.sample, action)).toEqual(NO_EDITED_MODELS_STATE.sample);
	});

	it('should not modify editedByKey, if it is empty', () => {
		const action = {
			keys: [1, 2]
		};
		expect(commonReducers.removeEdited(EMPTY_EDITED_MODELS_STATE.sample, action)).toEqual(EMPTY_EDITED_MODELS_STATE.sample);
	});
});