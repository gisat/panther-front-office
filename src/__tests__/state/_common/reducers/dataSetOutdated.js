import _ from "lodash";
import commonReducers from "../../../../state/_common/reducers";
import {
	BASIC_STATE, NO_MODELS_STATE, EMPTY_MODELS_STATE
} from "../../../../__testUtils/sampleStates/_common";

describe('#dataSetOutdated', () => {
	it('should set outdated to all models', () => {
		let output = commonReducers.dataSetOutdated(BASIC_STATE.sample);
		_.forIn(output.byKey, (model, key) => {
			expect(model.outdated).toBeTruthy();
		});
	});

	it('should not modify byKey, if it is null', () => {
		expect(commonReducers.dataSetOutdated(NO_MODELS_STATE.sample)).toEqual(NO_MODELS_STATE.sample);
	});

	it('should not modify byKey, if it is an empty object', () => {
		expect(commonReducers.dataSetOutdated(EMPTY_MODELS_STATE.sample)).toEqual(EMPTY_MODELS_STATE.sample);
	});
});
