import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {getSubstate, BASIC_STATE, NO_MODELS_STATE, EMPTY_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";
import _ from "lodash";

describe('#getAllAsObject', () => {
	const basicStateExpectedOutput = BASIC_STATE.sample.byKey;

	it('selected data should equal expected object', () => {
		expect(commonSelectors.getAllAsObject(getSubstate)(BASIC_STATE)).toEqual(basicStateExpectedOutput);
	});

	it('should select null, if data does not exist', () => {
		expect(commonSelectors.getAllAsObject(getSubstate)(NO_MODELS_STATE)).toBeNull();
	});

	it('should select empty object, if data data is empty object', () => {
		let selection = commonSelectors.getAllAsObject(getSubstate)(EMPTY_MODELS_STATE);
		expect(_.isEmpty(selection)).toBeTruthy();
	});
});