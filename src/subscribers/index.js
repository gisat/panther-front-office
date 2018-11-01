import aoi from './aoi';
import areas from './areas';
import attributes from './attributes';
import attributeSets from './attributeSets';
import choropleths from './choropleths';
import components from './components';
import layerTemplates from './layerTemplates';
import lpisCases from './lpisCases';
import maps from './maps';
import periods from './periods';
import places from './places';
import scenarios from './scenarios';
import scopes from './scopes';
import symbologies from './symbologies';
import users from './users';
import views from './views';
import wmsLayers from './wmsLayers';

export default store => {
	console.log('Create subscribers', store);
	aoi(store);
	areas(store);
	attributes(store);
	attributeSets(store);
	choropleths(store);
	components(store);
	layerTemplates(store);
	lpisCases(store);
	maps(store);
	periods(store);
	places(store);
	scenarios(store);
	scopes(store);
	symbologies(store);
	users(store);
	views(store);
	wmsLayers(store);
};