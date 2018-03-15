import { createStore, combineReducers, applyMiddleware } from 'redux';

import mapsReducers from './Maps/reducers';
import periodsReducers from './Periods/reducers';
import wmsLayersReducers from './WmsLayers/reducers';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import subscribers from '../subscribers';

// Redux store
const Store = createStore(combineReducers({
	maps: mapsReducers,
	periods: periodsReducers,
	wmsLayers: wmsLayersReducers
}), applyMiddleware(thunk, logger));

subscribers(Store);

export default Store;
