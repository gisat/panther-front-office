import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { reduxBatch } from '@manaflair/redux-batch';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { wrapHistory } from "oaf-react-router";

// base types
import {appReducers,casesReducers,periodsReducers,placesReducers,scopesReducers} from '@gisatcz/ptr-state';
import tacrAgritasData from "../../tacrAgritas/state/Data/reducers";

export const createHistory = (options) => {
	let history = createBrowserHistory(options);
	const settings = {
		primaryFocusTarget: "body",
		smoothScroll: true
	};
	wrapHistory(history, settings); //todo review behaviour
	return history;
};

// Redux store creator
export default history => {

	let middleware = applyMiddleware(thunk, routerMiddleware(history));
	if (process.env.NODE_ENV === 'development') {
		middleware = applyMiddleware(thunk, logger, routerMiddleware(history));
	}
	return createStore(combineReducers({
		specific: combineReducers({
			tacrAgritasData: tacrAgritasData,
		}),
		app: appReducers,
		cases: casesReducers,
		periods: periodsReducers,
		places: placesReducers,
		router: connectRouter(history),
		scopes: scopesReducers
	}), compose(reduxBatch, middleware, reduxBatch, applyMiddleware(thunk), reduxBatch));
}