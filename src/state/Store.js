import { createStore, combineReducers, applyMiddleware } from 'redux';

import mapsReducers from './Maps/reducers';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import Maps from '../subscribers/maps';

// Redux store
const Store = createStore(combineReducers({
	maps: mapsReducers
}), applyMiddleware(thunk, logger));

Maps(Store);

export default Store;
