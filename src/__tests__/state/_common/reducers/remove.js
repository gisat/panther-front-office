import commonReducers from "../../../../state/_common/reducers";
import {BASIC_STATE, NO_MODELS_STATE, EMPTY_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#remove', () => {
	it('should remove models', () => {
		const action = {
			keys: [2, 3, 4, 5, 6, 7, 8, 9, 10]
		};
		const expectedState = {
			...BASIC_STATE.sample,
			byKey: {
				1: {
					key: 1,
					data: {
						name: "World"
					},
					permissions: {
						activeUser: {get: true, update: true, delete: true},
						guest: {get: true, update: false, delete: false}
					}
				}
			}
		};
		expect(commonReducers.remove(BASIC_STATE.sample, action)).toEqual(expectedState);
	});

	it('should not remove any model', () => {
		const action = {
			keys: null
		};
		const expectedState = {...BASIC_STATE.sample};
		expect(commonReducers.remove(BASIC_STATE.sample, action)).toEqual(expectedState);
	});

	it('should not modify byKey, if it is null', () => {
		const action = {
			keys: [1, 2]
		};
		expect(commonReducers.remove(NO_MODELS_STATE.sample, action)).toEqual(NO_MODELS_STATE.sample);
	});

	it('should not modify byKey, if it is an empty object', () => {
		const action = {
			keys: [1, 2]
		};
		expect(commonReducers.remove(EMPTY_MODELS_STATE.sample, action)).toEqual(EMPTY_MODELS_STATE.sample);
	});
});