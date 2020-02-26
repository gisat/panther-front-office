import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { reduxBatch } from '@manaflair/redux-batch';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { wrapHistory } from "oaf-react-router";

// base types
import {appReducers,casesReducers,layerTemplatesReducers,mapsReducers,spatialDataSourcesReducers
	,spatialRelationsReducers,usersReducers} from '@gisatcz/ptr-state';


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
		app: appReducers,
		cases: casesReducers,
		layerTemplates: layerTemplatesReducers,
		maps: mapsReducers,
		router: connectRouter(history),
		spatialDataSources: spatialDataSourcesReducers,
		spatialRelations: spatialRelationsReducers,
		users: usersReducers,
	}), compose(reduxBatch, middleware, reduxBatch, applyMiddleware(thunk), reduxBatch));
}