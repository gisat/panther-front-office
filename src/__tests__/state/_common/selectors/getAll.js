import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {getSubstate, BASIC_STATE, NO_MODELS_STATE, EMPTY_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#getAll', () => {
	it('selected data shoud be in array, if exists', () => {
		expect(Array.isArray(commonSelectors.getAll(getSubstate)(BASIC_STATE))).toBeTruthy();
		expect(Array.isArray(commonSelectors.getAll(getSubstate)(EMPTY_MODELS_STATE))).toBeTruthy();
	});

	it('should select all models', () => {
		let substate = getSubstate(BASIC_STATE);
		let expectedLength = Object.values(substate.byKey).length;
		expect(commonSelectors.getAll(getSubstate)(BASIC_STATE)).toHaveLength(expectedLength);
	});

	it('it should select null, if byKey does not exist', () => {
		expect(commonSelectors.getAll(getSubstate)(NO_MODELS_STATE)).toBeNull();
	});

	it('it should select empty array, if byKey is empty object', () => {
		expect(commonSelectors.getAll(getSubstate)(EMPTY_MODELS_STATE)).toHaveLength(0);
	});
});