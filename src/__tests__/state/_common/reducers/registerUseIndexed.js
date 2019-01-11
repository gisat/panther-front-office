import commonReducers from "../../../../state/_common/reducers";
import {BASIC_STATE, NO_IN_USE_INDEXES_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#registerUseIndexed', () => {
	it('should add used index to existing object', () => {
		const action = {
			componentId: 'Component_added',
			filter: {dataset: 666},
			filterByActive: null,
			order: null,
			start: 1,
			length: 5
		};
		const expectedState = {
			...BASIC_STATE.sample,
			inUse: {
				...BASIC_STATE.sample.inUse,
				indexes: {
					...BASIC_STATE.sample.inUse.indexes,
					Component_added: {
						filter: {dataset: 666},
						filterByActive: null,
						order: null,
						start: 1,
						length: 5
					}
				}
			}
		};
		expect(commonReducers.registerUseIndexed(BASIC_STATE.sample, action)).toEqual(expectedState);
	});

	it('should add used index to empty object', () => {
		const action = {
			componentId: 'Component_added',
			filter: {dataset: 666},
			filterByActive: null,
			order: null,
			start: 1,
			length: 5
		};
		const expectedState = {
			...NO_IN_USE_INDEXES_STATE.sample,
			inUse: {
				...NO_IN_USE_INDEXES_STATE.sample.inUse,
				indexes: {
					Component_added: {
						filter: {dataset: 666},
						filterByActive: null,
						order: null,
						start: 1,
						length: 5
					}
				}
			}
		};
		expect(commonReducers.registerUseIndexed(NO_IN_USE_INDEXES_STATE.sample, action)).toEqual(expectedState);
	});

	it('should replace used index in existing object', () => {
		const action = {
			componentId: 'Component_d',
			filter: null,
			filterByActive: null,
			order: null,
			start: 3,
			length: 5
		};
		const expectedStateFragment = {
			filter: null,
			filterByActive: null,
			order: null,
			start: 3,
			length: 5
		};
		let result = commonReducers.registerUseIndexed(BASIC_STATE.sample, action);
		expect(result.inUse.indexes.Component_d).toEqual(expectedStateFragment);
	});
});