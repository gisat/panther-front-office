import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {getSubstate, NO_ACTIVE_KEY_STATE, ACTIVE_KEYS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#getActiveKeys', () => {
	it('should select active keys', () => {
		expect(commonSelectors.getActiveKeys(getSubstate)(ACTIVE_KEYS_STATE)).toEqual([1, 2]);
	});

	it('should return null, when active keys is null', () => {
		expect(commonSelectors.getActiveKeys(getSubstate)(NO_ACTIVE_KEY_STATE)).toBeNull();
	});
});