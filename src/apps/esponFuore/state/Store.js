import { createStore, combineReducers, applyMiddleware, compose, thunk, logger, reduxBatch } from '@gisatcz/ptr-state';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

// specific types
import indicatorReducers from './EsponFuoreIndicators/reducers';
import selectionsReducers from './EsponFuoreSelections/reducers';

// base types
import {appReducers,areasReducers,areaRelationsReducers,attributeRelationsReducers,attributesReducers,attributeSetsReducers,attributeDataReducers,attributeDataSourcesReducers,attributeStatisticsReducers,casesReducers,chartsReducers,componentsReducers,layerPeriodsReducers,layerTemplatesReducers,layersTreesReducers,mapsReducers,periodsReducers,placesReducers,scenariosReducers,scopesReducers,screensReducers,snapshotsReducers,spatialDataReducers,spatialDataSourcesReducers, spatialVectorDataSourcesReducers
	,spatialRelationsReducers,stylesReducers,tagsReducers,usersReducers,viewsReducers,windowsReducers} from '@gisatcz/ptr-state';

export const history = createBrowserHistory();

let middleware = applyMiddleware(thunk, routerMiddleware(history));
if (process.env.NODE_ENV === 'development') {
	middleware = applyMiddleware(thunk, logger, routerMiddleware(history));
}

// Redux store
export default createStore(combineReducers({
	specific: combineReducers({
		esponFuoreIndicators: indicatorReducers,
		esponFuoreSelections: selectionsReducers
	}),
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
	cases: casesReducers,
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