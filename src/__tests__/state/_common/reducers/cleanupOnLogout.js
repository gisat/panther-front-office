import commonReducers from "../../../../state/_common/reducers";
import {
	BASIC_STATE,
	EMPTY_MODELS_STATE,
	NO_MODELS_STATE
} from "../../../../__testUtils/sampleStates/_common";
import _ from "lodash";

describe('#cleanupOnLogout', () => {
	it('should cleanup models permissions, if the model has get permission for guest', () => {
		const expectedStateFragment = {
			key: 1,
			data: {
				name: "World"
			},
			permissions: {
				guest: {get: true, update: false, delete: false}
			}
		};

		let output = commonReducers.cleanupOnLogout(BASIC_STATE.sample);
		expect(output.byKey[1]).toEqual(expectedStateFragment);
	});

	it('should remove model, if it has not get permission for guest', () => {
		let output = commonReducers.cleanupOnLogout(BASIC_STATE.sample);
		expect(output.byKey.hasOwnProperty(3)).toBeFalsy();
	});

	it('should not modify byKey, if it is null', () => {
		expect(commonReducers.cleanupOnLogout(NO_MODELS_STATE.sample)).toEqual(NO_MODELS_STATE.sample);
	});

	it('should not modify byKey, if it is an empty object', () => {
		expect(commonReducers.cleanupOnLogout(EMPTY_MODELS_STATE.sample)).toEqual(EMPTY_MODELS_STATE.sample);
	});
});