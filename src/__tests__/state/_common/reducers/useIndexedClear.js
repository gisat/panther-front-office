import commonReducers from "../../../../state/_common/reducers";
import {BASIC_STATE, NO_IN_USE_INDEXES_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#useIndexedClear', () => {
	it('should clear used index', () => {
		const action = {
			componentId: 'Component_d',
		};
		const expectedState = {
			...BASIC_STATE.sample,
			inUse: {
				...BASIC_STATE.sample.inUse,
				indexes: {
					Component_a: {
						filter: {dataset: 666},
						filterByActive: null,
						order: null,
						start: 1,
						length: 5
					},
					Component_b: {
						filter: null,
						filterByActive: {scope: true},
						order: null,
						start: 6,
						length: 5
					},
					Component_c: {
						filter: null,
						filterByActive: null,
						order: [['name', 'ascending']],
						start: 1,
						length: 5
					},
				}
			}
		};
		expect(commonReducers.useIndexedClear(BASIC_STATE.sample, action)).toEqual(expectedState);
	});

	it('should do nothing when there is no in use index for given componentId', () => {
		const action = {
			componentId: 'Component_e',
		};
		const expectedState = {
			...BASIC_STATE.sample,
			inUse: {
				...BASIC_STATE.sample.inUse,
				indexes: {
					Component_a: {
						filter: {dataset: 666},
						filterByActive: null,
						order: null,
						start: 1,
						length: 5
					},
					Component_b: {
						filter: null,
						filterByActive: {scope: true},
						order: null,
						start: 6,
						length: 5
					},
					Component_c: {
						filter: null,
						filterByActive: null,
						order: [['name', 'ascending']],
						start: 1,
						length: 5
					},
					Component_d: {
						filter: null,
						filterByActive: null,
						order: [['name', 'ascending']],
						start: 3,
						length: 5
					}
				}
			}
		};
		expect(commonReducers.useIndexedClear(BASIC_STATE.sample, action)).toEqual(expectedState);
	});

	it('in use indexes should be null, if all indexes were cleared', () => {
		const oneInUseIndexesState = {
			...NO_IN_USE_INDEXES_STATE.sample,
			inUse: {
				...NO_IN_USE_INDEXES_STATE.sample.inUse,
				indexes: {
					Component_aa: {
						filter: {dataset: 666},
						filterByActive: null,
						order: null,
						start: 1,
						length: 5
					}
				}
			}
		};
		const expectedState = {
			...NO_IN_USE_INDEXES_STATE.sample,
			inUse: {
				...NO_IN_USE_INDEXES_STATE.sample.inUse,
				indexes: null
			}
		};
		expect(commonReducers.useIndexedClear(oneInUseIndexesState, {componentId: 'Component_aa'})).toEqual(expectedState);
	});
});