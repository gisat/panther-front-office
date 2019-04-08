import commonReducers from "../../../../state/_common/reducers";
import {
	getState,
	BASIC_STATE,
	EMPTY_INDEXES_STATE,
	NO_INDEXES_STATE
} from "../../../../__testUtils/sampleStates/_common";

describe('#clearIndexes', () => {
	it('should clear all indexes', () => {
		const expectedState = {
			...getState().sample,
			indexes: [
				{
					changedOn: "2018-12-03T15:25:12.745Z",
					count: null,
					filter: {scope: 666},
					order: null,
					index: null,
					"outdated": {
						"1": 1,
						"3": 3,
						"4": 11,
					},
					"outdatedCount": 4,
				}, {
					changedOn: "2018-12-03T15:25:12.745Z",
					count: null,
					filter: null,
					order: [['name', 'ascending']],
					index: null,
					outdated: {
						"1": 4,
						"10": 1,
						"2": 5,
						"3": 10,
						"4": 2,
						"5": 9,
						"6": 3,
						"7": 6,
						"8": 7,
						"9": 8,
					},
					"outdatedCount": 10,
				}
			],
		};
		expect(commonReducers.clearIndexes(getState().sample)).toEqual(expectedState);
	});

	it('should not modify state if there are no indexes', () => {
		const expectedState = {
			...NO_INDEXES_STATE.sample,
			indexes: null
		};
		expect(commonReducers.clearIndexes(NO_INDEXES_STATE.sample)).toEqual(expectedState);
	});
});