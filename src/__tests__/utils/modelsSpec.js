import {filterScopesByUrl} from '../../utils/models';

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
		expect(filterScopesByUrl(scopes, "http://dromas.gisat.cz")).toHaveLength(1);
		expect(filterScopesByUrl(scopes, "http://panther.gisat.cz")).toHaveLength(2);
		expect(filterScopesByUrl(scopes, "http://puma.gisat.cz")).toHaveLength(0);
	});
});