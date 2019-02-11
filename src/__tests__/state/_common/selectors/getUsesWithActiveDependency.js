import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {
	getSubstate,
	BASIC_STATE,
	EMPTY_IN_USE_INDEXES_STATE,
	NO_IN_USE_INDEXES_STATE, EMPTY_IN_USE_KEYS_STATE, NO_IN_USE_KEYS_STATE
} from "../../../../__testUtils/sampleStates/_common";

const EXTENDED_BASIC_STATE = {
	...BASIC_STATE,
	periods: {
		activeKey: 777
	},
	sample: {
		...BASIC_STATE.sample,
		inUse: {
			...BASIC_STATE.sample.inUse,
			indexes: {
				Component_a: [{
					filter: {scope: 666},
					filterByActive: null,
					order: null,
					start: 1,
					length: 5
				}, {
					filter: null,
					filterByActive: {scope: true},
					order: null,
					start: 15,
					length: 5
				}],
				Component_b: [{
					filter: null,
					filterByActive: {scope: true},
					order: null,
					start: 6,
					length: 5
				}],
				Component_c: [{
					filter: null,
					filterByActive: null,
					order: [['name', 'ascending']],
					start: 1,
					length: 5
				}],
				Component_d: [{
					filter: null,
					filterByActive: {scope: true, period: true},
					order: [['name', 'ascending']],
					start: 3,
					length: 5
				}, {
					filter: null,
					filterByActive: null,
					order: [['name', 'ascending']],
					start: 7,
					length: 5
				}],
				Component_e: [{
					filter: {period: 666},
					filterByActive: {scope: true},
					order: [['name', 'ascending']],
					start: 3,
					length: 5
				}, {
					filter: null,
					filterByActive: {scope: true},
					order: null,
					start: 3,
					length: 5
				}],
				Component_f: [{
					filter: {period: 666},
					filterByActive: {scope: true},
					order: [['name', 'ascending']],
					start: 2,
					length: 8
				}, {
					filter: null,
					filterByActive: {scope: true},
					order: null,
					start: 1,
					length: 3
				}]
			}
		}
	}
};

describe('#getUsesWithActiveDependency', () => {
	it('should select uses with active dependency on scope', () => {
		const filterByActive = {scope: true};
		const expectedOutput = [
			{
				filter: {scope: 666},
				order: null,
				uses: [{
					start: 1,
					length: 10
				}, {
					start: 15,
					length: 5
				}]
			}, {
				filter: {scope: 666, period: 777},
				order: [['name', 'ascending']],
				uses: [{
					start: 3,
					length: 5
				}]
			}, {
				filter: {period: 666, scope: 666},
				order: [['name', 'ascending']],
				uses: [{
					start: 2,
					length: 8
				}]
			}
		];
		expect(commonSelectors.getUsesWithActiveDependency(getSubstate)(EXTENDED_BASIC_STATE, filterByActive)).toEqual(expectedOutput);
	});

	it('should select uses with active dependency on period', () => {
		const filterByActive = {period: true};
		const expectedOutput = [{
			filter: {scope: 666, period: 777},
			order: [['name', 'ascending']],
			uses: [{
				start: 3,
				length: 5
			}]
		}];
		expect(commonSelectors.getUsesWithActiveDependency(getSubstate)(EXTENDED_BASIC_STATE, filterByActive)).toEqual(expectedOutput);
	});

	it('should select uses with active dependency both on scope and period', () => {
		const filterByActive = {period: true, scope: true};
		const expectedOutput = [{
			filter: {scope: 666, period: 777},
			order: [['name', 'ascending']],
			uses: [{
				start: 3,
				length: 5
			}]
		}];
		expect(commonSelectors.getUsesWithActiveDependency(getSubstate)(EXTENDED_BASIC_STATE, filterByActive)).toEqual(expectedOutput);
	});

	it('should select null if no filterByActive was given', () => {
		expect(commonSelectors.getUsesWithActiveDependency(getSubstate)(EXTENDED_BASIC_STATE)).toBeNull();
	});

	it('should select null if inUse.indexes is empty', () => {
		const filterByActive = {scope: true};
		expect(commonSelectors.getUsesWithActiveDependency(getSubstate)(EMPTY_IN_USE_INDEXES_STATE, filterByActive)).toBeNull();
	});

	it('should select null if inUse.indexes is null', () => {
		const filterByActive = {scope: true};
		expect(commonSelectors.getUsesWithActiveDependency(getSubstate)(NO_IN_USE_INDEXES_STATE, filterByActive)).toBeNull();
	});
});