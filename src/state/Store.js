import { createStore, combineReducers, applyMiddleware } from 'redux';

import mapsReducers from './Maps/reducers';
import periodsReducers from './Periods/reducers';
import scopesReducers from './Scopes/reducers';
import wmsLayersReducers from './WmsLayers/reducers';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import Maps from '../subscribers/maps';
import Periods from '../subscribers/periods';
import Scopes from '../subscribers/scopes';
import WmsLayers from '../subscribers/wmsLayers';

// Redux store
const Store = createStore(combineReducers({
	maps: mapsReducers,
	periods: periodsReducers,
	scopes: scopesReducers,
	wmsLayers: wmsLayersReducers,
}), applyMiddleware(thunk, logger));

Maps(Store);
Periods(Store);
Scopes(Store);
WmsLayers(Store);

export default Store;
