import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

// specific types
import appsReducers from './Apps/reducers';

import indicatorsReducers from '../../esponFuore/state/EsponFuoreIndicators/reducers';

// base types
import appReducers from '../../../state/App/reducers';
import areasReducers from '../../../state/Areas/reducers';
import attributesReducers from '../../../state/Attributes/reducers';
import attributeSetsReducers from '../../../state/AttributeSets/reducers';
import componentsReducers from '../../../state/Components/reducers';
import layerPeriodsReducers from '../../../state/LayerPeriods/reducers';
import layerTemplatesReducers from '../../../state/LayerTemplates/reducers';
import mapsReducers from '../../../state/Maps/reducers';
import periodsReducers from '../../../state/Periods/reducers';
import placesReducers from '../../../state/Places/reducers';
import scenariosReducers from '../../../state/Scenarios/reducers';
import scopesReducers from '../../../state/Scopes/reducers';
import screensReducers from '../../../state/Screens/reducers';
import snapshotsReducers from '../../../state/Snapshots/reducers';
import spatialDataSourcesReducers from '../../../state/SpatialDataSources/reducers';
import spatialRelationsReducers from '../../../state/SpatialRelations/reducers';
import stylesReducers from '../../../state/Styles/reducers';
import tagsReducers from '../../../state/Tags/reducers';
import usersReducers from '../../../state/Users/reducers';
import viewsReducers from '../../../state/Views/reducers';

export const history = createBrowserHistory();

// Redux store
export default createStore(combineReducers({
	specific: combineReducers({
		apps: appsReducers,
		esponFuoreIndicators: indicatorsReducers
	}),
	app: appReducers,
	areas: areasReducers,
	attributes: attributesReducers,
	attributeSets: attributeSetsReducers,
	components: componentsReducers,
	layerPeriods: layerPeriodsReducers,
	layerTemplates: layerTemplatesReducers,
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