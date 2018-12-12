import commonReducers from "../../../../state/_common/reducers";
import {
	BASIC_STATE,
	EMPTY_INDEXES_STATE,
	NO_INDEXES_STATE
} from "../../../../__testUtils/sampleStates/_common";

describe('#clearIndexes', () => {
	it('should clear all indexes', () => {
		const expectedState = {
			...BASIC_STATE.sample,
			indexes: [
				{
					changedOn: "2018-12-03T15:25:12.745Z",
					count: null,
					filter: {dataset: 666},
					order: null,
					index: null
				}, {
					changedOn: "2018-12-03T15:25:12.745Z",
					count: null,
					filter: null,
					order: [['name', 'ascending']],
					index: null
				}
			],
		};
		expect(commonReducers.clearIndexes(BASIC_STATE.sample)).toEqual(expectedState);
	});

	it('should not modify state if there are no indexes', () => {
		const expectedState = {
			...NO_INDEXES_STATE.sample,
			indexes: null
		};
		expect(commonReducers.clearIndexes(NO_INDEXES_STATE.sample)).toEqual(expectedState);
	});
});