import commonReducers from "../../../../state/_common/reducers";
import {BASIC_STATE, EMPTY_IN_USE_KEYS_STATE, NO_IN_USE_KEYS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#useKeysRegister', () => {
	it('should add used keys to existing object', () => {
		const action = {
			componentId: 'Component_added',
			keys: [1, 2]
		};
		const expectedState = {
			...BASIC_STATE.sample,
			inUse: {
				...BASIC_STATE.sample.inUse,
				keys: {
					...BASIC_STATE.sample.inUse.keys,
					Component_added: [1, 2]
				}
			}
		};
		expect(commonReducers.useKeysRegister(BASIC_STATE.sample, action)).toEqual(expectedState);
	});

	it('should add used keys to empty object', () => {
		const action = {
			componentId: 'Component_added',
			keys: [1, 2]
		};
		const expectedState = {
			...NO_IN_USE_KEYS_STATE.sample,
			inUse: {
				...NO_IN_USE_KEYS_STATE.sample.inUse,
				keys: {
					Component_added: [1, 2]
				}
			}
		};
		expect(commonReducers.useKeysRegister(NO_IN_USE_KEYS_STATE.sample, action)).toEqual(expectedState);
	});

	it('should add used keys to existing use', () => {
		const action = {
			componentId: 'Component_w',
			keys: [4]
		};
		const expectedStateFragment = {
			Component_w: [1, 2, 3, 4],
			Component_x: [3, 4]
		};
		let result = commonReducers.useKeysRegister(BASIC_STATE.sample, action);
		expect(result.inUse.keys).toEqual(expectedStateFragment);
	});
});