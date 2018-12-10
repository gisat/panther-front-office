import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {getSubstate, BASIC_STATE, NO_ACTIVE_KEY_STATE, NO_EDITED_MODELS_STATE, EMPTY_EDITED_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#getEditedByKey', () => {
	const expectedBasicStateOutput = {
		key: 1,
		data: {
			name: "Svět"
		}
	};

	it('selected data should equal expected object', () => {
		expect(commonSelectors.getEditedByKey(getSubstate)(BASIC_STATE, 1)).toEqual(expectedBasicStateOutput);
	});

	it('should select null, if data does not exist', () => {
		expect(commonSelectors.getEditedByKey(getSubstate)(NO_EDITED_MODELS_STATE, 1)).toBeNull();
	});

	it('should select null, when editedByKey is empty object', () => {
		expect(commonSelectors.getEditedActive(getSubstate)(EMPTY_EDITED_MODELS_STATE, 1)).toBeNull();
	});
});