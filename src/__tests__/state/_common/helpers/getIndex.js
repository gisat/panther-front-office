import commonHelpers from "../../../../state/_common/helpers";

const INDEXES = [
	{
		changedOn: "2018-12-03T15:25:12.745Z",
		count: 4,
		filter: {dataset: 666},
		order: null,
		index: {1: 1, 3: 3, 4: 11}
	}, {
		changedOn: "2018-12-03T15:25:12.745Z",
		count: 10,
		filter: null,
		order: [['name', 'ascending']],
		index: {1: 4, 2: 5, 3: 10, 4: 2, 5: 9, 6: 3, 7: 6, 8: 7, 9: 8, 10: 1}
	}, {
		changedOn: "2018-12-03T15:25:12.745Z",
		count: 10,
		filter: {scope: 1, place: 2},
		order: [['name', 'ascending'], ['description', 'descending']],
		index: {1: 4}
	},
];

describe('#getIndex', () => {
	it('should return index according to given parameters', () => {
		const filter = null;
		const order = [['name', 'ascending']];
		const expectedOutput = {
			changedOn: "2018-12-03T15:25:12.745Z",
			count: 10,
			filter: null,
			order: [['name', 'ascending']],
			index: {1: 4, 2: 5, 3: 10, 4: 2, 5: 9, 6: 3, 7: 6, 8: 7, 9: 8, 10: 1}
		};

		expect(commonHelpers.getIndex(INDEXES, filter, order)).toEqual(expectedOutput);
	});

	it('should return index according to given parameters 2', () => {
		const filter = {place: 2, scope: 1};
		const order = [['name', 'ascending'], ['description', 'descending']];
		const expectedOutput = {
			changedOn: "2018-12-03T15:25:12.745Z",
			count: 10,
			filter: {scope: 1, place: 2},
			order: [['name', 'ascending'], ['description', 'descending']],
			index: {1: 4}
		};

		expect(commonHelpers.getIndex(INDEXES, filter, order)).toEqual(expectedOutput);
	});

	it('should return null, if order of order parameters is different', () => {
		const filter = {place: 2, scope: 1};
		const order = [['description', 'descending'], ['name', 'ascending']];
		expect(commonHelpers.getIndex(INDEXES, filter, order)).toBeNull();
	});

	it('should return null, if there are no indexes', () => {
		const filter = {place: 2, scope: 1};
		const order = [['description', 'descending'], ['name', 'ascending']];
		expect(commonHelpers.getIndex(null, filter, order)).toBeNull();
	});
});