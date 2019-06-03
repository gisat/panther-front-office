import commonReducers from "../../../../state/_common/reducers";
import {BASIC_STATE, ACTIVE_KEYS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#setActiveMultiple', () => {
	it('should set active keys', () => {
		const action = {
			keys: [1,2]
		};
		const expectedState = {
			...BASIC_STATE.sample,
			activeKey: null,
			activeKeys: [1,2]
		};
		expect(commonReducers.setActiveMultiple(BASIC_STATE.sample, action)).toEqual(expectedState);
	});

	it('should set active keys to null', () => {
		const action = {
			keys: null
		};
		const expectedState = {
			...BASIC_STATE.sample,
			activeKey: null,
			activeKeys: null
		};
		expect(commonReducers.setActiveMultiple(ACTIVE_KEYS_STATE.sample, action)).toEqual(expectedState);
	});

	it('should change active keys', () => {
		const action = {
			keys: [2, 3]
		};
		const expectedState = {
			...ACTIVE_KEYS_STATE.sample,
			activeKey: null,
			activeKeys: [2, 3]
		};
		expect(commonReducers.setActiveMultiple(ACTIVE_KEYS_STATE.sample, action)).toEqual(expectedState);
	});
});