import commonReducers from "../../../../state/_common/reducers";
import {
	getState,
	EMPTY_INDEXES_STATE,
	NO_INDEXES_STATE
} from "../../../../__testUtils/sampleStates/_common";

describe('#clearIndexes', () => {
	it('should clear index', () => {
		const state = getState();
		const expectedState = {
			...state.sample,
			indexes: [
				{
					changedOn: null,
					count: null,
					filter: {scope: 666},
					order: null,
					index: null
				}, {
					changedOn: "2018-12-03T15:25:12.745Z",
					count: 10,
					filter: null,
					order: [['name', 'ascending']],
					index: {1: 4, 2: 5, 3: 10, 4: 2, 5: 9, 6: 3, 7: 6, 8: 7, 9: 8, 10: 1}
				}
			],
		};

		const action = {
			filter: {scope: 666},
			order: null,
		}
		expect(commonReducers.clearIndex(state.sample, action)).toEqual(expectedState);
	});
	it('should not clear index, wrong filter', () => {
		const state = getState();

		const action = {
			filter: {scope: 'wrong'},
			order: null,
		}
		expect(commonReducers.clearIndex(state.sample, action)).toEqual(state.sample);
	});
});