import { createStore, combineReducers, applyMiddleware, compose, thunk, logger, reduxBatch } from '@gisatcz/ptr-state';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { wrapHistory } from "oaf-react-router";

// base types
import {appReducers,areasReducers,areaRelationsReducers,attributeRelationsReducers,attributesReducers,attributeSetsReducers,attributeDataReducers,attributeDataSourcesReducers,attributeStatisticsReducers,casesReducers,chartsReducers,componentsReducers,layerPeriodsReducers,layerTemplatesReducers,layersTreesReducers,mapsReducers,periodsReducers,placesReducers,scenariosReducers,scopesReducers,screensReducers,selectionsReducers,snapshotsReducers,spatialDataReducers,spatialDataSourcesReducers
,spatialRelationsReducers,stylesReducers,tagsReducers,usersReducers,viewsReducers,windowsReducers} from '@gisatcz/ptr-state';

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
		areas: areasReducers,
		areaRelations: areaRelationsReducers,
		attributes: attributesReducers,
		attributeRelations: attributeRelationsReducers,
		attributeStatistics: attributeStatisticsReducers,
		attributeSets: attributeSetsReducers,
		attributeData: attributeDataReducers,
		attributeDataSources: attributeDataSourcesReducers,
		cases: casesReducers,
		charts: chartsReducers,
		components: componentsReducers,
		layerPeriods: layerPeriodsReducers,
		layerTemplates: layerTemplatesReducers,
		layersTrees: layersTreesReducers,
		maps: mapsReducers,
		periods: periodsReducers,
		places: placesReducers,
		router: connectRouter(history),
		scenarios: scenariosReducers,
		scopes: scopesReducers,
		screens: screensReducers,
		selections: selectionsReducers,
		snapshots: snapshotsReducers,
		spatialData: spatialDataReducers,
		spatialDataSources: spatialDataSourcesReducers,
		spatialRelations: spatialRelationsReducers,
		styles: stylesReducers,
		tags: tagsReducers,
		users: usersReducers,
		views: viewsReducers,
		windows: windowsReducers
	}), compose(reduxBatch, middleware, reduxBatch, applyMiddleware(thunk), reduxBatch));
}