import commonReducers from "../../../../state/_common/reducers";
import {BASIC_STATE, NO_EDITED_MODELS_STATE, EMPTY_EDITED_MODELS_STATE, NO_ACTIVE_KEY_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#removeEditedACtive', () => {
	it('should remove edited model, which is active', () => {
		const expectedState = {
			...BASIC_STATE.sample,
			editedByKey: {
				4: {
					key: 4,
					data: {
						name: "Česko"
					}
				},
				5: {
					key: 5,
					data: {}
				},
				'nejake-nahodne-uuid': {
					key: 'nejake-nahodne-uuid',
					data: {
						name: "Gisat"
					}
				}
			}
		};
		expect(commonReducers.removeEditedActive(BASIC_STATE.sample)).toEqual(expectedState);
	});

	it('should not remove any data from edited when active key is null', () => {
		const expectedState = {...NO_ACTIVE_KEY_STATE.sample};
		expect(commonReducers.removeEditedActive(NO_ACTIVE_KEY_STATE.sample)).toEqual(expectedState);
	});

	it('should not modify editedByKey, if it is null', () => {
		expect(commonReducers.removeEditedActive(NO_EDITED_MODELS_STATE.sample)).toEqual(NO_EDITED_MODELS_STATE.sample);
	});

	it('should not modify editedByKey, if it is empty', () => {
		expect(commonReducers.removeEditedActive(EMPTY_EDITED_MODELS_STATE.sample)).toEqual(EMPTY_EDITED_MODELS_STATE.sample);
	});
});