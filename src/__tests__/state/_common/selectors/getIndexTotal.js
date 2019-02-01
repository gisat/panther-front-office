import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {
	getSubstate,
	BASIC_STATE,
	NO_INDEXES_STATE,
	EMPTY_INDEXES_STATE
} from "../../../../__testUtils/sampleStates/_common";

describe('#getIndexTotal', () => {
	it('should select 10 as index total', () => {
		const filter = null;
		const order = [['name', 'ascending']];
		expect(commonSelectors.getIndexTotal(getSubstate)(BASIC_STATE, filter, order)).toBe(10);
	});

	it('should select 4 as index total', () => {
		const filter = {scope: 666};
		const order = null;
		expect(commonSelectors.getIndexTotal(getSubstate)(BASIC_STATE, filter, order)).toBe(4);
	});

	it('should select null as index total, if index does not exists', () => {
		let filter = null;
		let order = null;
		expect(commonSelectors.getIndexTotal(getSubstate)(BASIC_STATE, filter, order)).toBeNull();
	});
});