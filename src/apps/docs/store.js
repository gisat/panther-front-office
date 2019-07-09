import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { wrapHistory } from "oaf-react-router";

import appReducers from '../../state/App/reducers';
import usersReducers from '../../state/Users/reducers';

export const history = createBrowserHistory();
wrapHistory(history); //todo review behaviour

// Redux store
export default createStore(combineReducers({
	app: appReducers,
	router: connectRouter(history),
	users: usersReducers,
}), applyMiddleware(thunk, logger, routerMiddleware(history)));