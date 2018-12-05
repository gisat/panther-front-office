import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {
	getSubstate,
	BASIC_STATE,
	NO_INDEXES_STATE,
	EMPTY_INDEXES_STATE
} from "../../../../__testUtils/sampleCommonStates";

describe('#getIndexPage', () => {
	it('should select index', () => {
		const filter = null;
		const order = [['name', 'ascending']];
		const start = 3;
		const length = 2;

		const expectedBasicStateOutput = {3: 10, 4: 2};

		expect(commonSelectors.getIndexPage(getSubstate)(BASIC_STATE, filter, order, start, length)).toEqual(expectedBasicStateOutput);
	});

	it('should select index', () => {
		const filter = {dataset: 666};
		const order = null;
		const start = 4;
		const length = 3;

		const expectedResult = {4: 11};

		expect(commonSelectors.getIndexPage(getSubstate)(BASIC_STATE, filter, order, start, length)).toEqual(expectedResult);
	});

	it('should select index', () => {
		const filter = null;
		const order = [['name', 'ascending']];
		const start = 10;
		const length = 3;

		const expectedResultForStartAt10 = {10: 1};

		expect(commonSelectors.getIndexPage(getSubstate)(BASIC_STATE, filter, order, start, length)).toEqual(expectedResultForStartAt10);
	});
});