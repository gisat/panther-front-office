import _ from "lodash";
import commonReducers from "../../../../state/_common/reducers";
import {
	getState, BASIC_STATE, NO_MODELS_STATE, EMPTY_MODELS_STATE
} from "../../../../__testUtils/sampleStates/_common";

describe('#markDeleted', () => {
	it('should mark data as deleted', () => {
		const state = getState().sample;
		const output = commonReducers.markDeleted(state, {key: 1});
		expect(output.byKey[1].removed).toEqual(true);
	});

	it('should end with error caused by unknown key do delete', () => {
		const state = getState().sample;
		const unknownKey = 99999;
		const output = commonReducers.markDeleted(state, {key: unknownKey});
		expect(output.byKey[unknownKey]).toEqual(undefined);
	});

	
});
