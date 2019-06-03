import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {getSubstate, BASIC_STATE, NO_ACTIVE_KEY_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#getActiveKey', () => {
	it('should select active key', () => {
		expect(commonSelectors.getActiveKey(getSubstate)(BASIC_STATE)).toBe(1);
	});

	it('should return null, when active key is not set', () => {
		expect(commonSelectors.getActiveKey(getSubstate)(NO_ACTIVE_KEY_STATE)).toBeNull();
	});
});