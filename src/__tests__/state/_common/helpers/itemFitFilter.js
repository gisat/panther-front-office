import commonHelpers from "../../../../state/_common/helpers";

describe('#isCorrespondingIndex', () => {
	it('should identify corresponding filter', () => {
		const activeKeys = {
			
		};
		const filterByActive = {
			scope: true
		};
		const filter = null;

		const expectedOutput = true;

		expect(commonHelpers.isCorrespondingIndex(activeKeys, filterByActive, filter)).toEqual(expectedOutput);
	});
});