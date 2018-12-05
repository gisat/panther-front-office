import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {getSubstate, BASIC_STATE, NO_MODELS_STATE, EMPTY_MODELS_STATE} from "../../../../__testUtils/sampleCommonStates";
import _ from "lodash";

describe('#getAllForDataviewAsObject', () => {
	const expectedObjectForGivenKey = {
		name: "World",
		id: 1,
		_id: 1
	};

	it('selected data should equal expected object', () => {
		let selection = commonSelectors.getAllForDataviewAsObject(getSubstate)(BASIC_STATE);
		expect(selection[1]).toEqual(expectedObjectForGivenKey);
	});

	it('should select null, if data does not exist', () => {
		expect(commonSelectors.getAllForDataviewAsObject(getSubstate)(NO_MODELS_STATE)).toBeNull();
	});

	it('it should select empty array, if byKey is empty object', () => {
		expect(commonSelectors.getAllForDataview(getSubstate)(EMPTY_MODELS_STATE)).toHaveLength(0);
	});

	it('should select empty object, if data data is empty object', () => {
		let selection = commonSelectors.getAllForDataviewAsObject(getSubstate)(EMPTY_MODELS_STATE);
		expect(_.isEmpty(selection)).toBeTruthy();
	});
});