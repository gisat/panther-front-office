import { createStore, combineReducers, applyMiddleware } from 'redux';

import mapsReducers from './Maps/reducers';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

// Redux store
const Store = createStore(combineReducers({
	maps: mapsReducers
}), applyMiddleware(thunk, logger));

export default Store;
