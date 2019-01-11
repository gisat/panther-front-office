import commonReducers from "../../../../state/_common/reducers";
import {BASIC_STATE, NO_INDEXES_STATE, NO_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#addIndex', () => {
	it('should add an initial set of data', () => {
		const action = {
			changedOn: "2018-12-03T15:25:12.745Z",
			count: 4,
			filter: {dataset: 666},
			order: null,
			start: 1,
			data: [{key: 1}, {key: 3}, {key: 11}]
		};
		const expectedState = {
			...NO_INDEXES_STATE.sample,
			indexes: [{
				changedOn: "2018-12-03T15:25:12.745Z",
				count: 4,
				filter: {dataset: 666},
				order: null,
				index: {1: 1, 2: 3, 3: 11}
			}]
		};
		expect(commonReducers.addIndex(NO_INDEXES_STATE.sample, action)).toEqual(expectedState);
	});

	it('should find existing index and add indexes to it', () => {
		const action = {
			changedOn: "2018-12-03T15:25:12.745Z",
			count: 10,
			filter: null,
			order: [['name', 'ascending']],
			start: 11,
			data: [{key: 20}, {key: 21}, {key: 22}]
		};
		const expectedStateFragment = {
			changedOn: "2018-12-03T15:25:12.745Z",
			count: 10,
			filter: null,
			order: [['name', 'ascending']],
			index: {1: 4, 2: 5, 3: 10, 4: 2, 5: 9, 6: 3, 7: 6, 8: 7, 9: 8, 10: 1, 11: 20, 12: 21, 13: 22}
		};
		expect(commonReducers.addIndex(BASIC_STATE.sample, action).indexes).toContainEqual(expectedStateFragment);
	});

	it('should find existing index and add indexes to it', () => {
		const action = {
			changedOn: "2018-12-03T15:25:12.745Z",
			count: 4,
			filter: {dataset: 666},
			order: null,
			start: 1,
			data: [{key: 10}, {key: 12}, {key: 13}]
		};
		const expectedStateFragment = {
			changedOn: "2018-12-03T15:25:12.745Z",
			count: 4,
			filter: {dataset: 666},
			order: null,
			index: {1: 10, 2: 12, 3: 13, 4: 11}
		};
		expect(commonReducers.addIndex(BASIC_STATE.sample, action).indexes).toContainEqual(expectedStateFragment);
	});
});