import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {getSubstate, BASIC_STATE, NO_ACTIVE_KEY_STATE, NO_EDITED_MODELS_STATE, EMPTY_EDITED_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";
import _ from "lodash";

describe('#getEditedAllAsObject', () => {
	const expectedBasicStateOutput = {...BASIC_STATE.sample.editedByKey};

	it('selected data should equal expected object', () => {
		expect(commonSelectors.getEditedAllAsObject(getSubstate)(BASIC_STATE)).toEqual(expectedBasicStateOutput);
	});

	it('should select null, if data does not exist', () => {
		expect(commonSelectors.getEditedAllAsObject(getSubstate)(NO_EDITED_MODELS_STATE)).toBeNull();
	});

	it('should select empty object, if data data is empty object', () => {
		let selection = commonSelectors.getEditedAllAsObject(getSubstate)(EMPTY_EDITED_MODELS_STATE);
		expect(_.isEmpty(selection)).toBeTruthy();
	});
});