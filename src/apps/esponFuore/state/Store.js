import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { reduxBatch } from '@manaflair/redux-batch';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

// specific types
import indicatorReducers from './EsponFuoreIndicators/reducers';
import selectionsReducers from './EsponFuoreSelections/reducers';

// base types
import appReducers from '../../../state/App/reducers';
import areasReducers from '../../../state/Areas/reducers';
import attributeRelationsReducers from '../../../state/AttributeRelations/reducers';
import attributesReducers from '../../../state/Attributes/reducers';
import attributeSetsReducers from '../../../state/AttributeSets/reducers';
import attributeData from '../../../state/AttributeData/reducers';
import attributeDataSources from '../../../state/AttributeDataSources/reducers';
import chartsReducers from '../../../state/Charts/reducers';
import componentsReducers from '../../../state/Components/reducers';
import casesReducers from '../../../state/Cases/reducers';
import layerPeriodsReducers from '../../../state/LayerPeriods/reducers';
import layerTemplatesReducers from '../../../state/LayerTemplates/reducers';
import layerTreeReducers from '../../../state/LayersTrees/reducers';
import mapsReducers from '../../../state/Maps/reducers';
import periodsReducers from '../../../state/Periods/reducers';
import placesReducers from '../../../state/Places/reducers';
import scenariosReducers from '../../../state/Scenarios/reducers';
import scopesReducers from '../../../state/Scopes/reducers';
import screensReducers from '../../../state/Screens/reducers';
import snapshotsReducers from '../../../state/Snapshots/reducers';
import spatialDataSourcesReducers from '../../../state/SpatialDataSources/reducers';
import spatialVectorDataSourcesReducers from '../../../state/SpatialDataSources/vector/reducers';
import spatialRelationsReducers from '../../../state/SpatialRelations/reducers';
import stylesReducers from '../../../state/Styles/reducers';
import attributeStatisticsReducers from '../../../state/AttributeStatistics/reducers';
import tagsReducers from '../../../state/Tags/reducers';
import usersReducers from '../../../state/Users/reducers';
import viewsReducers from '../../../state/Views/reducers';
import windowsReducers from '../../../state/Windows/reducers';

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
	attributeData: attributeData,
	attributeDataSources: attributeDataSources,
	charts: chartsReducers,
	components: componentsReducers,
	cases: casesReducers,
	layerPeriods: layerPeriodsReducers,
	layerTemplates: layerTemplatesReducers,
	layersTrees: layerTreeReducers,
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