import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {getSubstate, NO_MODELS_STATE, NO_ACTIVE_KEY_STATE, ACTIVE_KEYS_STATE, EMPTY_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#getActiveModels', () => {
	const expectedActiveKeysStateOutput = [{
		key: 1,
		data: {
			name: "World"
		},
		permissions: {
			activeUser: {get: true, update: true, delete: true},
			guest: {get: true, update: false, delete: false}
		}
	}, {
		key: 2,
		data: {
			name: "Europe"
		},
		permissions: {
			activeUser: {get: true, update: true, delete: true},
			guest: {get: true, update: false, delete: false}
		}
	}];

	it('should select active models', () => {
		expect(commonSelectors.getActiveModels(getSubstate)(ACTIVE_KEYS_STATE)).toEqual(expectedActiveKeysStateOutput);
	});

	it('should select undefined, when active keys is null', () => {
		expect(commonSelectors.getActiveModels(getSubstate)(NO_ACTIVE_KEY_STATE)).toBeNull();
	});

	it('should select null, when byKey do not exist', () => {
		expect(commonSelectors.getActiveModels(getSubstate)(NO_MODELS_STATE)).toBeNull();
	});

	it('should select null, when byKey is empty object', () => {
		expect(commonSelectors.getActiveModels(getSubstate)(EMPTY_MODELS_STATE)).toBeNull();
	});
});