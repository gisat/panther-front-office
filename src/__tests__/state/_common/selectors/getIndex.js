import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {
	getSubstate,
	BASIC_STATE,
	NO_INDEXES_STATE,
	EMPTY_INDEXES_STATE
} from "../../../../__testUtils/sampleCommonStates";

describe('#getIndex', () => {
	it('should select index', () => {
		const filter = null;
		const order = [['name', 'ascending']];
		const expectedBasicStateOutput = {
			changedOn: "2018-12-03T15:25:12.745Z",
			order: [['name', 'ascending']],
			filter: null,
			count: 10,
			index: {1: 4, 2: 5, 3: 10, 4: 2, 5: 9, 6: 3, 7: 6, 8: 7, 9: 8, 10: 1}
		};
		expect(commonSelectors.getIndex(getSubstate)(BASIC_STATE, filter, order)).toEqual(expectedBasicStateOutput);
	});

	it('should not select index, if it does not exist', () => {
		const filter = null;
		const order = null;
		expect(commonSelectors.getIndex(getSubstate)(BASIC_STATE, filter, order)).toBeNull();
	});

	it('should select null, when indexes do not exist', () => {
		expect(commonSelectors.getIndex(getSubstate)(NO_INDEXES_STATE)).toBeNull();
	});

	it('should select null, when indexes is an empty array', () => {
		expect(commonSelectors.getIndex(getSubstate)(EMPTY_INDEXES_STATE)).toBeNull();
	});

});