import {models} from 'panther-utils';

const scopes = [{
	key: 1
},{
	key: 2,
	urls: ["http://dromas.gisat.cz", "http://panther.gisat.cz"]
},{
	key: 3,
	urls: ["http://panther.gisat.cz"]
}];

describe('Models utils#filterScopesByUrl', () => {
	it('should return only models for given url and scopes, which have urls parameter not defined', () => {
		expect(models.filterScopesByUrl(scopes, "http://dromas.gisat.cz")).toHaveLength(1);
		expect(models.filterScopesByUrl(scopes, "http://panther.gisat.cz")).toHaveLength(2);
		expect(models.filterScopesByUrl(scopes, "http://puma.gisat.cz")).toHaveLength(0);
	});
});