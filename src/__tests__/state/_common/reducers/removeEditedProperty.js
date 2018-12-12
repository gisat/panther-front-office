import commonReducers from "../../../../state/_common/reducers";
import {BASIC_STATE, NO_EDITED_MODELS_STATE, EMPTY_EDITED_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#removeEditedProperty', () => {
	it('should remove property from edited model', () => {
		const action = {
			key: 1,
			property: "name"
		};
		const expectedState = {
			...BASIC_STATE.sample,
			editedByKey: {
				1: {
					key: 1,
					data: {
						description: "..."
					}
				},
				4: {
					key: 4,
					data: {
						name: "Česko"
					}
				},
				'nejake-nahodne-uuid': {
					key: 'nejake-nahodne-uuid',
					data: {
						name: "Gisat"
					}
				}
			}
		};
		expect(commonReducers.removeEditedProperty(BASIC_STATE.sample, action)).toEqual(expectedState);
	});

	it('should not remove anything, if property does not exist', () => {
		const action = {
			key: 1,
			property: "language"
		};
		expect(commonReducers.removeEditedProperty(BASIC_STATE.sample, action)).toEqual(BASIC_STATE.sample);
	});

	it('should not remove anything, if edited model does not exist', () => {
		const action = {
			key: 3,
			property: "name"
		};
		expect(commonReducers.removeEditedProperty(BASIC_STATE.sample, action)).toEqual(BASIC_STATE.sample);
	});

	it('should not modify editedByKey, if it is null', () => {
		const action = {
			key: 1,
			property: "name"
		};
		expect(commonReducers.removeEditedProperty(NO_EDITED_MODELS_STATE.sample, action)).toEqual(NO_EDITED_MODELS_STATE.sample);
	});

	it('should not modify editedByKey, if it is empty', () => {
		const action = {
			key: 1,
			property: "name"
		};
		expect(commonReducers.removeEditedProperty(EMPTY_EDITED_MODELS_STATE.sample, action)).toEqual(EMPTY_EDITED_MODELS_STATE.sample);
	});
});