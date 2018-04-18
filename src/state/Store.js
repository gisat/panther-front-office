import { createStore, combineReducers, applyMiddleware } from 'redux';

import aoiReducers from './AOI/reducers';
import attributesReducers from './Attributes/reducers';
import attributeSetsReducers from './AttributeSets/reducers';
import componentsReducers from './Components/reducers';
import layerPeriodsReducers from './LayerPeriods/reducers';
import mapsReducers from './Maps/reducers';
import periodsReducers from './Periods/reducers';
import placesReducers from './Places/reducers';
import scopesReducers from './Scopes/reducers';
import userReducers from './User/reducers';
import wmsLayersReducers from './WmsLayers/reducers';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import subscribers from '../subscribers';

// Redux store
const Store = createStore(combineReducers({
	aoi: aoiReducers,
	attributes: attributesReducers,
	attributeSets: attributeSetsReducers,
	components: componentsReducers,
	layerPeriods: layerPeriodsReducers,
	maps: mapsReducers,
	periods: periodsReducers,
	places: placesReducers,
	scopes: scopesReducers,
	user: userReducers,
	wmsLayers: wmsLayersReducers
}), applyMiddleware(thunk, logger));

subscribers(Store);

export default Store;
