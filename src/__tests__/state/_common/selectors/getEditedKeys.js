import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {getSubstate, BASIC_STATE, NO_ACTIVE_KEY_STATE, NO_EDITED_MODELS_STATE, EMPTY_EDITED_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#getEditedKeys', () => {
	const expectedBasicStateOutput = [1, 4, 'nejake-nahodne-uuid'];
	it('selected data should equal expected object', () => {
		expect(commonSelectors.getEditedKeys(getSubstate)(BASIC_STATE)).toEqual(expectedBasicStateOutput);
	});

	it('should select null, if data does not exist', () => {
		expect(commonSelectors.getEditedKeys(getSubstate)(NO_EDITED_MODELS_STATE)).toBeNull();
	});

	it('should select null, if editedByKey is empty object', () => {
		expect(commonSelectors.getEditedKeys(getSubstate)(EMPTY_EDITED_MODELS_STATE)).toBeNull();
	});
});