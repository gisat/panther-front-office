import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {getSubstate, BASIC_STATE, NO_ACTIVE_KEY_STATE, NO_EDITED_MODELS_STATE, EMPTY_EDITED_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#getEditedAll', () => {
	it('selected data shoud be in array, if exists', () => {
		expect(Array.isArray(commonSelectors.getEditedAll(getSubstate)(BASIC_STATE))).toBeTruthy();
		expect(Array.isArray(commonSelectors.getEditedAll(getSubstate)(EMPTY_EDITED_MODELS_STATE))).toBeTruthy();
	});

	it('should select all edited data', () => {
		let length = Object.values({...BASIC_STATE.sample.editedByKey}).length;
		expect(commonSelectors.getEditedAll(getSubstate)(BASIC_STATE)).toHaveLength(length);
	});

	it('it should select null, if editedByKey does not exist', () => {
		expect(commonSelectors.getEditedAll(getSubstate)(NO_EDITED_MODELS_STATE)).toBeNull();
	});

	it('it should select empty array, if editedByKey is empty object', () => {
		expect(commonSelectors.getEditedAll(getSubstate)(EMPTY_EDITED_MODELS_STATE)).toHaveLength(0);
	});
});