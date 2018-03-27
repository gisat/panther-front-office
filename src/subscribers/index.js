import aoi from './aoi';
import maps from './maps';
import periods from './periods';
import scopes from './scopes';
import user from './user';
import wmsLayers from './wmsLayers';

export default store => {
	console.log('Create subscribers', store);
	aoi(store);
	maps(store);
	periods(store);
	scopes(store);
	user(store);
	wmsLayers(store);
};