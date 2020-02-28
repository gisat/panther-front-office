import { createStore, combineReducers, applyMiddleware, compose, thunk, logger, reduxBatch } from '@gisatcz/ptr-state';
import { connectRouter, routerMiddleware } from '@gisatcz/ptr-state';
import { createBrowserHistory } from 'history';

// base types
import {_deprecatedSelectionsReducers, appReducers,areasReducers,areaRelationsReducers,attributeRelationsReducers,attributesReducers,attributeSetsReducers,attributeDataReducers,attributeDataSourcesReducers,attributeStatisticsReducers,casesReducers,chartsReducers,componentsReducers,layerPeriodsReducers,layerTemplatesReducers,layersTreesReducers,mapsReducers,periodsReducers,placesReducers,scenariosReducers,scopesReducers,screensReducers,selectionsReducers,snapshotsReducers,spatialDataReducers,spatialDataSourcesReducers, spatialVectorDataSourcesReducers,spatialRelationsReducers,stylesReducers,tagsReducers,usersReducers,viewsReducers,windowsReducers} from '@gisatcz/ptr-state';

export const history = createBrowserHistory();

let middleware = applyMiddleware(thunk, routerMiddleware(history));
if (process.env.NODE_ENV === 'development') {
	middleware = applyMiddleware(thunk, logger, routerMiddleware(history));
}

// Redux store
export default createStore(combineReducers({
	_deprecatedSelections: _deprecatedSelectionsReducers,
	app: appReducers,
	areas: areasReducers,
	attributes: attributesReducers,
	attributeRelations: attributeRelationsReducers,
	attributeStatistics: attributeStatisticsReducers,
	attributeSets: attributeSetsReducers,
	attributeData: attributeDataReducers,
	attributeDataSources: attributeDataSourcesReducers,
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
	snapshots: snapshotsReducers,
	spatialDataSources: spatialDataSourcesReducers,
	spatialVectorDataSources: spatialVectorDataSourcesReducers,
	spatialRelations: spatialRelationsReducers,
	styles: stylesReducers,
	tags: tagsReducers,
	users: usersReducers,
	views: viewsReducers,
	windows: windowsReducers
}), compose(reduxBatch, middleware, reduxBatch, applyMiddleware(thunk), reduxBatch));