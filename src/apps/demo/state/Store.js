import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { reduxBatch } from '@manaflair/redux-batch';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { wrapHistory } from "oaf-react-router";

// base types
import appReducers from '../../../state/App/reducers';
import casesReducers from '../../../state/Cases/reducers';
import layerTemplatesReducers from '../../../state/LayerTemplates/reducers';
import usersReducers from '../../../state/Users/reducers';
import mapsReducers from '../../../state/Maps/reducers';
import spatialDataSourcesReducers from "../../../state/SpatialDataSources/reducers";
import spatialRelationsReducers from "../../../state/SpatialRelations/reducers";


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