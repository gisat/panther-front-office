import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {
	getSubstate,
	BASIC_STATE,
	EMPTY_IN_USE_INDEXES_STATE,
	NO_IN_USE_INDEXES_STATE
} from "../../../../__testUtils/sampleStates/_common";

describe('#getUsesForIndex', () => {
	it('should select used index for given filter and order with merged uses', () => {
		const filter = {scopeKey: 666};
		const order = null;

		const expectedBasicStateOutput = {
			filter: {scopeKey: 666},
			order: null,
			uses: [{
				length: 10,
				start: 1
			}]
		};

		expect(commonSelectors.getUsesForIndex(getSubstate)(BASIC_STATE, filter, order)).toEqual(expectedBasicStateOutput);
	});

	it('should select used index for given filter and order with merged uses', () => {
		const WITHOUT_ACTIVE_SCOPE = {...BASIC_STATE, scopes: {}};
		const filter = null;
		const order = [['name', 'ascending']];

		const expectedWithoutActiveScopeStateOutput = {
			filter: null,
			order: [['name', 'ascending']],
			uses: [{
				length: 11,
				start: 1
			}]
		};

		expect(commonSelectors.getUsesForIndex(getSubstate)(WITHOUT_ACTIVE_SCOPE, filter, order)).toEqual(expectedWithoutActiveScopeStateOutput);
	});

	it('should select used index for given filter and order with merged uses', () => {
		const WITHOUT_ACTIVE_SCOPE = {...BASIC_STATE, scopes: {}};
		const filter = {scopeKey: 666};
		const order = null;

		const expectedWithoutActiveScopeStateOutput = {
			filter: {scopeKey: 666},
			order: null,
			uses: [{
				length: 5,
				start: 1
			}]
		};

		expect(commonSelectors.getUsesForIndex(getSubstate)(WITHOUT_ACTIVE_SCOPE, filter, order)).toEqual(expectedWithoutActiveScopeStateOutput);
	});

	it('should select null, if index for given filter and order does not exist', () => {
		const filter = null;
		const order = [['name', 'descending']];

		expect(commonSelectors.getUsesForIndex(getSubstate)(BASIC_STATE, filter, order)).toBeNull();
	});

	it('should select null if inUse.indexes does not exist or it is null', () => {
		expect(commonSelectors.getUsesForIndex(getSubstate)(NO_IN_USE_INDEXES_STATE)).toBeNull();
	});

	it('should select null if inUse.indexes is empty object', () => {
		expect(commonSelectors.getUsesForIndex(getSubstate)(EMPTY_IN_USE_INDEXES_STATE)).toBeNull();
	});
});