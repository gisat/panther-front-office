import maps from './maps';
import periods from './periods';
import wmsLayers from './wmsLayers';

export default store => {
	console.log('Create subscribers', store);
	maps(store);
	periods(store);
	wmsLayers(store);
};