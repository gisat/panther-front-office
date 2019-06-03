import commonReducers from "../../../../state/_common/reducers";
import {BASIC_STATE, NO_IN_USE_INDEXES_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#useKeysClear', () => {
	it('should clear used keys', () => {
		const action = {
			componentId: 'Component_w',
		};
		const expectedState = {
			...BASIC_STATE.sample,
			inUse: {
				...BASIC_STATE.sample.inUse,
				keys: {
					Component_x: [3, 4]
				}
			}
		};
		expect(commonReducers.useKeysClear(BASIC_STATE.sample, action)).toEqual(expectedState);
	});

	it('should do nothing when there are no in use keys for given componentId', () => {
		const action = {
			componentId: 'Component_e',
		};
		const expectedState = {
			...BASIC_STATE.sample,
			inUse: {
				...BASIC_STATE.sample.inUse,
				keys: {
					Component_w: [1, 2, 3],
					Component_x: [3, 4]
				}
			}
		};
		expect(commonReducers.useKeysClear(BASIC_STATE.sample, action)).toEqual(expectedState);
	});

	it('in use keys should be null, if all indexes were cleared', () => {
		const oneInUseIndexesState = {
			...NO_IN_USE_INDEXES_STATE.sample,
			inUse: {
				...NO_IN_USE_INDEXES_STATE.sample.inUse,
				keys: {
					Component_aa: [2, 3]
				}
			}
		};
		const expectedState = {
			...NO_IN_USE_INDEXES_STATE.sample,
			inUse: {
				...NO_IN_USE_INDEXES_STATE.sample.inUse,
				keys: null
			}
		};
		expect(commonReducers.useKeysClear(oneInUseIndexesState, {componentId: 'Component_aa'})).toEqual(expectedState);
	});
});