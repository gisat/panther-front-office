import aoi from './aoi';
import attributes from './attributes';
import attributeSets from './attributeSets';
import components from './components';
import maps from './maps';
import periods from './periods';
import places from './places';
import scenarios from './scenarios';
import scopes from './scopes';
import users from './users';
import wmsLayers from './wmsLayers';

export default store => {
	console.log('Create subscribers', store);
	aoi(store);
	attributes(store);
	attributeSets(store);
	components(store);
	maps(store);
	periods(store);
	places(store);
	scenarios(store);
	scopes(store);
	users(store);
	wmsLayers(store);
};