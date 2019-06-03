import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {getSubstate, BASIC_STATE, NO_MODELS_STATE, NO_ACTIVE_KEY_STATE, EMPTY_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#getByKey', () => {
	const expectedBasicStateOutput = {
		key: 1,
		data: {
			name: "World"
		},
		permissions: {
			activeUser: {get: true, update: true, delete: true},
			guest: {get: true, update: false, delete: false}
		}
	};

	it('selected data should equal expected object', () => {
		expect(commonSelectors.getByKey(getSubstate)(BASIC_STATE, 1)).toEqual(expectedBasicStateOutput);
	});

	it('should select null, if data does not exist', () => {
		expect(commonSelectors.getByKey(getSubstate)(NO_MODELS_STATE, 1)).toBeNull();
	});

	it('should select null, when byKey is empty object', () => {
		expect(commonSelectors.getByKey(getSubstate)(EMPTY_MODELS_STATE, 1)).toBeNull();
	});

	it('should select null, when no key was given', () => {
		expect(commonSelectors.getByKey(getSubstate)(BASIC_STATE, null)).toBeNull();
	});
});