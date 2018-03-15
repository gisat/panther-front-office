import { createStore, combineReducers, applyMiddleware } from 'redux';

import mapsReducers from './Maps/reducers';
import wmsLayersReducers from './WmsLayers/reducers';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import Maps from '../subscribers/maps';
import WmsLayers from '../subscribers/wmsLayers';

// Redux store
const Store = createStore(combineReducers({
	maps: mapsReducers,
	wmsLayers: wmsLayersReducers,
}), applyMiddleware(thunk, logger));

Maps(Store);
WmsLayers(Store);

export default Store;
