import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {
	getSubstate,
	BASIC_STATE,
	EMPTY_IN_USE_KEYS_STATE,
	NO_IN_USE_KEYS_STATE
} from "../../../../__testUtils/sampleStates/_common";

describe('#getUsedKeys', () => {
	it('should select used keys', () => {
		const expectedOutput = [1, 2, 3, 4];
		expect(commonSelectors.getUsedKeys(getSubstate)(BASIC_STATE)).toEqual(expectedOutput);
	});

	it('should select null if inUse.keys is empty', () => {
		expect(commonSelectors.getUsedKeys(getSubstate)(EMPTY_IN_USE_KEYS_STATE)).toBeNull();
	});

	it('should select null if inUse.keys is null', () => {
		expect(commonSelectors.getUsedKeys(getSubstate)(NO_IN_USE_KEYS_STATE)).toBeNull();
	});
});