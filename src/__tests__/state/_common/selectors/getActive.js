import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {getSubstate, BASIC_STATE, NO_MODELS_STATE, NO_ACTIVE_KEY_STATE, EMPTY_MODELS_STATE} from "../../../../__testUtils/sampleCommonStates";

describe('#getActive', () => {
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

	it('should select active data from state', () => {
		expect(commonSelectors.getActive(getSubstate)(BASIC_STATE)).toEqual(expectedBasicStateOutput);
	});

	it('should select undefined, when byKey do not exist', () => {
		expect(commonSelectors.getActive(getSubstate)(NO_MODELS_STATE)).toBeNull();
	});

	it('should select null, when byKey is empty object', () => {
		expect(commonSelectors.getActive(getSubstate)(EMPTY_MODELS_STATE)).toBeNull();
	});

	it('should select undefined, when active key is null', () => {
		expect(commonSelectors.getActive(getSubstate)(NO_ACTIVE_KEY_STATE)).toBeNull();
	});
});