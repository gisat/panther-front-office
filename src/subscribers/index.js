import aoi from './aoi';
import attributes from './attributes';
import attributeSets from './attributeSets';
import components from './components';
import maps from './maps';
import periods from './periods';
import places from './places';
import scopes from './scopes';
import user from './user';
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
	scopes(store);
	user(store);
	wmsLayers(store);
};