import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {
	getSubstate,
	BASIC_STATE,
	EMPTY_IN_USE_INDEXES_STATE,
	NO_IN_USE_INDEXES_STATE
} from "../../../../__testUtils/sampleStates/_common";

describe('#getUsedIndexPages', () => {
	it('should select used index pages with merged uses', () => {
		const expectedBasicStateOutput = [{
			filter: {dataset: 666},
			order: null,
			uses: [{
				length: 10,
				start: 1
			}]
		}, {
			filter: {},
			order: [['name', 'ascending']],
			uses: [{
				length: 7,
				start: 1
			}]
		}];
		expect(commonSelectors.getUsedIndexPages(getSubstate)(BASIC_STATE)).toEqual(expectedBasicStateOutput);
	});

	it('should select null if inUse.indexes does not exist or it is null', () => {
		expect(commonSelectors.getUsedIndexPages(getSubstate)(NO_IN_USE_INDEXES_STATE)).toBeNull();
	});

	it('should select null if inUse.indexes is empty object', () => {
		expect(commonSelectors.getUsedIndexPages(getSubstate)(EMPTY_IN_USE_INDEXES_STATE)).toBeNull();
	});
});