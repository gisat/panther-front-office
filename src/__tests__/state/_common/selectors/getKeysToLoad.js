import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {
	getSubstate,
	BASIC_STATE,
	NO_MODELS_STATE,
	EMPTY_MODELS_STATE
} from "../../../../__testUtils/sampleStates/_common";

describe('#getKeysToLoad', () => {
	it('should select null if keys is null', () => {
		let keys = null;
		expect(commonSelectors.getKeysToLoad(getSubstate)(BASIC_STATE, keys)).toEqual(null);
	});

	it('should select null if keys are empty array', () => {
		let keys = [];
		expect(commonSelectors.getKeysToLoad(getSubstate)(BASIC_STATE, keys)).toEqual(null);
	});

	it('should select null if all keys are already loaded', () => {
		let keys = [1,2];
		expect(commonSelectors.getKeysToLoad(getSubstate)(BASIC_STATE, keys)).toEqual(null);
	});

	it('should select all keys if there are no models loaded already', () => {
		let keys = [1,2];
		let state = {...NO_MODELS_STATE, byKey: null};
		expect(commonSelectors.getKeysToLoad(getSubstate)(state, keys)).toEqual([1,2]);
	});

	it('should select all keys if there are no models loaded already', () => {
		let keys = [1,2];
		let state = {...EMPTY_MODELS_STATE, byKey: null};
		expect(commonSelectors.getKeysToLoad(getSubstate)(state, keys)).toEqual([1,2]);
	});

	it('should select only unloaded keys', () => {
		let keys = [1,2,43,44];
		expect(commonSelectors.getKeysToLoad(getSubstate)(BASIC_STATE, keys)).toEqual([43,44]);
	});
});