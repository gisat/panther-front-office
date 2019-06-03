import commonReducers from "../../../../state/_common/reducers";
import {BASIC_STATE, ACTIVE_KEYS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#setActive', () => {
	it('should set active key', () => {
		const action = {
			key: 2
		};
		const expectedState = {
			...BASIC_STATE.sample,
			activeKey: 2,
			activeKeys: null
		};
		expect(commonReducers.setActive(BASIC_STATE.sample, action)).toEqual(expectedState);
	});

	it('should set active key to null', () => {
		const action = {
			key: null
		};
		const expectedState = {
			...BASIC_STATE.sample,
			activeKey: null,
			activeKeys: null
		};
		expect(commonReducers.setActive(BASIC_STATE.sample, action)).toEqual(expectedState);
	});

	it('should set active key and reset active keys', () => {
		const action = {
			key: 'aaa'
		};
		const expectedState = {
			...ACTIVE_KEYS_STATE.sample,
			activeKey: 'aaa',
			activeKeys: null
		};
		expect(commonReducers.setActive(ACTIVE_KEYS_STATE.sample, action)).toEqual(expectedState);
	});
});