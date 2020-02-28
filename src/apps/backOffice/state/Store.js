import { createStore, combineReducers, applyMiddleware, thunk, logger} from '@gisatcz/ptr-state';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

// specific types
import appsReducers from './Apps/reducers';
import configurationsReducers from './Configurations/reducers';

import indicatorsReducers from '../../esponFuore/state/EsponFuoreIndicators/reducers';

// base types
import {appReducers,areasReducers,areaRelationsReducers,attributeRelationsReducers,attributesReducers,attributeSetsReducers,attributeDataReducers,attributeDataSourcesReducers,attributeStatisticsReducers,casesReducers,chartsReducers,componentsReducers,layerPeriodsReducers,layerTemplatesReducers,layersTreesReducers,mapsReducers,periodsReducers,placesReducers,scenariosReducers,scopesReducers,screensReducers,selectionsReducers,snapshotsReducers,spatialDataReducers,spatialDataSourcesReducers
	,spatialRelationsReducers,stylesReducers,tagsReducers,usersReducers,viewsReducers,windowsReducers} from '@gisatcz/ptr-state';

export const history = createBrowserHistory();

// Redux store
export default createStore(combineReducers({
	specific: combineReducers({
		apps: appsReducers,
		configurations: configurationsReducers,
		esponFuoreIndicators: indicatorsReducers
	}),
	app: appReducers,
	areas: areasReducers,
	attributes: attributesReducers,
	attributeRelations: attributeRelationsReducers,
	attributeSets: attributeSetsReducers,
	cases: casesReducers,
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
	spatialRelations: spatialRelationsReducers,
	styles: stylesReducers,
	tags: tagsReducers,
	users: usersReducers,
	views: viewsReducers
}), applyMiddleware(thunk, logger, routerMiddleware(history)));