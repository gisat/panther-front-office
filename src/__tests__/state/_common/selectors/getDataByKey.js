import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {getSubstate, BASIC_STATE, NO_MODELS_STATE, NO_ACTIVE_KEY_STATE, EMPTY_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#getDataByKey', () => {
	it('selected data should equal expected object', () => {
		const expectedBasicStateOutput = {
			name: "World"
		};
		expect(commonSelectors.getDataByKey(getSubstate)(BASIC_STATE, 1)).toEqual(expectedBasicStateOutput);
	});

	it('should select null, when data does not exist in model', () => {
		expect(commonSelectors.getDataByKey(getSubstate)(BASIC_STATE, 11)).toBeNull();
	});

	it('should select empty object, if data in model is empty object', () => {
		expect(commonSelectors.getDataByKey(getSubstate)(BASIC_STATE, 12)).toEqual({});
	});

	it('should select null, when byKey is null', () => {
		expect(commonSelectors.getDataByKey(getSubstate)(NO_MODELS_STATE, 1)).toBeNull();
	});

	it('should select null, when byKey is empty object', () => {
		expect(commonSelectors.getDataByKey(getSubstate)(EMPTY_MODELS_STATE, 1)).toBeNull();
	});

	it('should select null, if model does not exist', () => {
		expect(commonSelectors.getDataByKey(getSubstate)(BASIC_STATE, 99)).toBeNull();
	});

	it('should select null, when no key was given', () => {
		expect(commonSelectors.getDataByKey(getSubstate)(BASIC_STATE, null)).toBeNull();
	});
});