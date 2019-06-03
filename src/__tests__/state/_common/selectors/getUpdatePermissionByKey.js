import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {getSubstate, BASIC_STATE, NO_MODELS_STATE, NO_ACTIVE_KEY_STATE, EMPTY_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#getUpdatePermissionByKey', () => {
	it('should return true, if activeUser has permission for update', () => {
		expect(commonSelectors.getUpdatePermissionByKey(getSubstate)(BASIC_STATE, 8)).toBeTruthy();
	});

	it('should return true, if guest has permission for update', () => {
		expect(commonSelectors.getUpdatePermissionByKey(getSubstate)(BASIC_STATE, 10)).toBeTruthy();
	});

	it('should return false, if permissions does not exists in model', () => {
		expect(commonSelectors.getUpdatePermissionByKey(getSubstate)(BASIC_STATE, 11)).toBeFalsy();
	});

	it('should return false, when byKey is null', () => {
		expect(commonSelectors.getUpdatePermissionByKey(getSubstate)(NO_MODELS_STATE, 1)).toBeFalsy();
	});

	it('should select false, if model does not exist', () => {
		expect(commonSelectors.getUpdatePermissionByKey(getSubstate)(BASIC_STATE, 99)).toBeFalsy();
	});

	it('should select false, when no key was given', () => {
		expect(commonSelectors.getUpdatePermissionByKey(getSubstate)(BASIC_STATE, null)).toBeFalsy();
	});
});