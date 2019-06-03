import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {getSubstate, BASIC_STATE, NO_EDITED_MODELS_STATE, EMPTY_EDITED_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#getEditedDataByKey', () => {
	it('selected data should equal expected object', () => {
		const expectedBasicStateOutput = {
			name: "Česko"
		};
		expect(commonSelectors.getEditedDataByKey(getSubstate)(BASIC_STATE, 4)).toEqual(expectedBasicStateOutput);
	});

	it('should select empty object, if data in model is empty object', () => {
		expect(commonSelectors.getEditedDataByKey(getSubstate)(BASIC_STATE, 5)).toEqual({});
	});

	it('should select null, when byKey is null', () => {
		expect(commonSelectors.getEditedDataByKey(getSubstate)(NO_EDITED_MODELS_STATE, 1)).toBeNull();
	});

	it('should select null, when byKey is empty object', () => {
		expect(commonSelectors.getEditedDataByKey(getSubstate)(EMPTY_EDITED_MODELS_STATE, 1)).toBeNull();
	});

	it('should select null, if model does not exist', () => {
		expect(commonSelectors.getEditedDataByKey(getSubstate)(BASIC_STATE, 99)).toBeNull();
	});

	it('should select null, when no key was given', () => {
		expect(commonSelectors.getEditedDataByKey(getSubstate)(BASIC_STATE, null)).toBeNull();
	});
});