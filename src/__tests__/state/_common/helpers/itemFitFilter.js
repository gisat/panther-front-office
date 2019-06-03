import helpers from "../../../../state/_common/helpers";

const filterScopePlace = {scope: 1, place: 2};
const filterScopePlace2 = {scope: 1, place: 22};
const filterScopeKey1 = {scope: 1};
const filterScopeKey666 = {scope: 666};
const filterIn = {beers: {in: [1,2,3, 'aaa', 'bbb']}};
const filterIn2 = {beers: {in: [1,2,3,4]}};
const filterLike = {place: {like: 'karel'}}; //we dont deal with like filter
const filterNotIn = {beers: {notin: [1,2,3]}};
const filterNotIn2 = {beers: {notin: [1,2,3, 'aaa']}};
const filterKey = {scopeKey: 1}; //check if filter contains linking like scopeKey, viewKey, ...
const filterKey2 = {scopeKey: 1, beers: {in: [1,2,3, 'aaa', 'bbb']}}; //check if filter contains linking like scopeKey, viewKey, ...
const filterKey3 = {scopeKey: 1, beers: {in: [1,2,3]}}; //check if filter contains linking like scopeKey, viewKey, ...
const filterNull = null;

const item1 = {
	data: {
		scopeKey: 1,
		place: 2
	}
}

const item2 = {
	data: {
		scopeKey: 1,
		place: 2,
		beers: 'aaa'
	}
}

describe('#isCorrespondingIndex', () => {
	it('should identify index according to given parameters', () => {
		const filter = null;
		const order = [['name', 'ascending']];
		
		//item1
		expect(helpers.itemFitFilter(filterScopeKey1, item1)).toBe(true);
		expect(helpers.itemFitFilter(filterScopeKey666, item1)).toBe(false);
		expect(helpers.itemFitFilter(filterScopePlace, item1)).toBe(true);
		expect(helpers.itemFitFilter(filterScopePlace2, item1)).toBe(false);
		expect(helpers.itemFitFilter(filterNull, item1)).toBe(true);

		//item2
		expect(helpers.itemFitFilter(filterIn, item2)).toBe(true);
		expect(helpers.itemFitFilter(filterIn2, item2)).toBe(false);
		//like is everytime true for now 
		expect(helpers.itemFitFilter(filterLike, item2)).toBe(true);
		expect(helpers.itemFitFilter(filterNotIn, item2)).toBe(true);
		expect(helpers.itemFitFilter(filterNotIn2, item2)).toBe(false);
		
		//key
		expect(helpers.itemFitFilter(filterKey, item2)).toBe(true);
		expect(helpers.itemFitFilter(filterKey2, item2)).toBe(true);
		expect(helpers.itemFitFilter(filterKey3, item2)).toBe(false); //all filters must be filled
	});
});