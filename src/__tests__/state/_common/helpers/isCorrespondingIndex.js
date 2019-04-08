import helpers from "../../../../state/_common/helpers";

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

describe('#isCorrespondingIndex', () => {
	it('should identify index according to given parameters', () => {
		const filter = null;
		const order = [['name', 'ascending']];
		
		expect(helpers.isCorrespondingIndex(INDEXES[0], filter, order)).toBe(false);
		expect(helpers.isCorrespondingIndex(INDEXES[1], filter, order)).toBe(true);
		expect(helpers.isCorrespondingIndex(INDEXES[2], filter, order)).toBe(false);
	});
});