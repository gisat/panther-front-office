import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {getSubstate, BASIC_STATE, NO_ACTIVE_KEY_STATE, NO_EDITED_MODELS_STATE, EMPTY_EDITED_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#getEditedActive', () => {
	const expectedBasicStateOutput = {
		key: 1,
		data: {
			name: "Svět",
			description: "..."
		}
	};

	it('should select active edited data from state', () => {
		expect(commonSelectors.getEditedActive(getSubstate)(BASIC_STATE)).toEqual(expectedBasicStateOutput);
	});

	it('should select null, when byKey do not exist', () => {
		expect(commonSelectors.getEditedActive(getSubstate)(NO_EDITED_MODELS_STATE)).toBeNull();
	});

	it('should select null, when active key is null', () => {
		expect(commonSelectors.getEditedActive(getSubstate)(NO_ACTIVE_KEY_STATE)).toBeNull();
	});

	it('should select null, when editedByKey is empty object', () => {
		expect(commonSelectors.getEditedActive(getSubstate)(EMPTY_EDITED_MODELS_STATE)).toBeNull();
	});
});